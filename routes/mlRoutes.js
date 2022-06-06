const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const _ = require('underscore')
const multer = require('multer')
const cp = require('cookie-parser')
const upload = multer({ dest: 'uploads/' })
const fs = require('fs')
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(cp())

app.post('/uploadOccupancy', upload.single('file'), function(req, res) {
  uploadOccupancy(req.file)
    res.status(201).send()
    
})

app.post('/uploadSlot', upload.single('file'), function(req, res) {
  uploadSlot(req.file)
    res.status(201).send()
    
})

app.get('/getSlot/:filename', async function(req, res) {

  try {
    const filename = req.params.filename
    bucketName = 'carkir-slot'
    const nameExtension = filename + '.json'
  } catch (error) {
    console.log(error)
    res.status(404).send('file not found')
  }

  try {
    const contents = await storage.bucket(bucketName).file(nameExtension).download();
    res.status(201).send(JSON.parse(contents))
  } catch (error) {
    console.log(error)
    res.status(404).send('file not found in storage')
  }
})
  
async function uploadOccupancy(file){
    bucketName = 'carkir-storage'
    try {
      filePath = './uploads/'+file.filename,
      destFileName = file.originalname
    } catch (error) {
      console.log(error)
    }

    async function uploadFile() {
      try {
        await storage.bucket(bucketName).upload(filePath, {
          destination: destFileName,
        });
        fs.unlinkSync(filePath)
        //file removed
      } catch(err) {
        console.error(err)
      }
      console.log(`${filePath} uploaded to ${bucketName}`);
    }
    uploadFile().catch(console.error);
}

async function uploadSlot(file){
  bucketName = 'carkir-slot'
  try {
    filePath = './uploads/'+file.filename
    destFileName = file.originalname

  } catch (error) {
    console.log(error)
  }
  async function uploadFile() {
    try {
      await storage.bucket(bucketName).upload(filePath, {
        destination: destFileName,
      });
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