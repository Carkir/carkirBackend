const express = require('express')
const app = express()
const fs = require('fs')
const Item = require('../models/tempatModels')
const bodyParser = require('body-parser');
const res = require('express/lib/response');
const { json } = require('express/lib/response');
const  db  = require('../server')

app.use(bodyParser.json())

app.get('/:floor&:cluster&:slot', async(req,res)=>{
  const floor = req.params.floor
  console.log(floor)
  const cluster = req.params.cluster
  console.log(cluster)
  const slot = req.params.slot
  const result = await Item.find( {coba2: {$elemMatch: {Floor:Number(floor),Cluster:`${cluster}`,Slot:Number(slot)}}},{_id:0,"coba2.Occupancy.$":1})
  res.send(Object.values(result[0].coba2[0])).status(201)
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