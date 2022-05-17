const express = require('express')
const app = express()
const fs = require('fs')
const Item = require('../models/tempatModels')
const bodyParser = require('body-parser');
const res = require('express/lib/response');
const { json } = require('express/lib/response');
const  db  = require('../server')

app.use(bodyParser.json())

app.get('/', async(req,res)=>{
  const result = await Item.find({coba2: {$elemMatch: {Cluster:"A",Floor:1}}})
  res.send(result)
})

app.get('/input', (req,res)=>{
    readDataFromJson()
    res.send('halo')
})

app.post('/', async function(req, res) {
    // Insert JSON straight into MongoDB
   db.collection('employees').insert(req.body, function (err, result) {
       if (err)
          res.send('Error');
       else
         res.send('Success');
 
   });
 });

async function readDataFromJson(){
    const data = fs.readFileSync("Mall_Metropolitan.json", "utf8", (err, jsonString) => {
        if (err) {
          console.log("File read failed:", err);
          return;
        }  
      });

      const item = new Item({
        coba2 : JSON.parse(data)
      })


      await item.save()

}
module.exports = app