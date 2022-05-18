const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const Item = require('../models/tempatModels')
const bodyParser = require('body-parser');
const res = require('express/lib/response');
const { json } = require('express/lib/response');
const  db  = require('../server')

app.use(bodyParser.json())

app.get('/:tempatParkir&:floor&:cluster&:slot', async(req,res)=>{
  const tempatParkir = req.params.tempatParkir
  const floor = req.params.floor
  const cluster = req.params.cluster
  const slot = req.params.slot
  const result = await Item.find({
    tempatParkir:`${tempatParkir}` , 
    coba2: {$elemMatch: {Floor:Number(floor),Cluster:`${cluster}`,Slot:Number(slot)}}},{_id:0,"coba2.Occupancy.$":1
  })
  res.send(Object.values(result[0].coba2[0])).status(201)
})

app.get('/input', (req,res)=>{
  inputDataFromJson()
    res.send('halo')
})

app.get('/update', async(req,res)=>{
  updateDataFromJson()
  res.send("update berhasil")
})

async function inputDataFromJson(){
const directoryPath = path.join(__dirname, '../Documents');
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(async function (file) {
      const data = fs.readFileSync(path.resolve(__dirname, "../Documents/"+file), "utf8", (err, jsonString) => {
        if (err) {
          console.log("File read failed:", err);
          return;
        }  
      });
      const item = new Item({
        tempatParkir : path.parse(file).name,
        denah : JSON.parse(data)
      })
      await item.save()  
        console.log(file); 
    });
});

}

async function updateDataFromJson(){
  const directoryPath = path.join(__dirname, '../Documents');
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      } 
      //listing all files using forEach
      files.forEach(async function (file) {
        const data = fs.readFileSync(path.resolve(__dirname, "../Documents/"+file), (err, jsonString) => {
          if (err) {
            console.log("File read failed:", err);
            return;
          }  
        });
        await Item.updateOne( { tempatParkir: path.parse(file).name },
            {
              $set: {
                denah : JSON.parse(data)
              }
            })
          console.log(file); 
      });
    });
}
module.exports = app