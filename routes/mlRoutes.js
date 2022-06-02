const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const _ = require('underscore')
const multer = require('multer')
const cp = require('cookie-parser')
const upload = multer({ dest: 'uploads/' })
const fs = require('fs')

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(cp())

app.post('/uploadOccupancy', upload.single('file'), function(req, res, next) {
    uploadCloud(req.file)
    res.status(201).send()
    
  })
  
async function uploadCloud(file){
    bucketName = 'carkir-storage',
    filePath = './uploads/'+file.filename,
    destFileName = file.originalname
  
    const {Storage} = require('@google-cloud/storage');
  
    const storage = new Storage();
  
    async function uploadFile() {
      await storage.bucket(bucketName).upload(filePath, {
        destination: destFileName,
      });
      const path = './file.txt'
  
      try {
        fs.unlinkSync(filePath)
        //file removed
      } catch(err) {
        console.error(err)
      }
      console.log(`${filePath} uploaded to ${bucketName}`);
    }
  
    uploadFile().catch(console.error);
  }

module.exports = app