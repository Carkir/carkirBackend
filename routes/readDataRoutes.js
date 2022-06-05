const express = require('express')
const app = express()
const Item = require('../models/tempatModels')
const bodyParser = require('body-parser');
const {createToken,verifyToken} = require('../functions/tokenize')
const cp = require('cookie-parser')

app.use(bodyParser.json())
app.use(cp())

app.get('/Occupancy/:name/:floor',verifyToken, async (req, res) => {
  if( req.user.masterAdmin!= null && Boolean(req.user.masterAdmin)!= true) return res.sendStatus(403)
  if( req.user.isAndroid!= null && Boolean(req.user.isAndroid)!= true) return res.sendStatus(403)

  const name = req.params.name
  const floor = req.params.floor
  const cluster = req.params.cluster
  const slot = req.params.slot
  const result = await Item.find({
    name: `${name}`
  })
  const data = result[0].denah
  let Occupancy = 0

  const filterDataByFloor = []
  data.forEach(element => {
    if(element.Floor == floor){
      filterDataByFloor.push(element)
      Occupancy += element.Occupancy
    }
  });
  
  filterDataByFloor.forEach(function (element) {
    element.floorAvailability = Occupancy;
  });
  res.status(201).send(filterDataByFloor)
})

app.get('/allPlace',verifyToken,async(req,res)=>{
  if( req.user.masterAdmin!= null && Boolean(req.user.masterAdmin)!= true) return res.sendStatus(403)
  if( req.user.isAndroid!= null && Boolean(req.user.isAndroid)!= true) return res.sendStatus(403)

  res.send(await Item.find({},{_id:0,name:1,status:1,time:1,totalEmptySpace:1,image:1}))
})

app.get('/all',verifyToken,async(req,res)=>{
  if( req.user.masterAdmin!= null && Boolean(req.user.masterAdmin)!= true) return res.sendStatus(403)

  res.send(await Item.find({},{_id:0,denah:0,clusterCount:0}))
})

app.get('/:name', verifyToken,async(req,res)=>{
  if( req.user.masterAdmin!= null && Boolean(req.user.masterAdmin)!= true) return res.sendStatus(403)
  if( req.user.isAndroid!= null && Boolean(req.user.isAndroid)!= true) return res.sendStatus(403)
  
    const name = req.params.name
    const result = await Item.findOne({
      name: `${name}`
      },{_id:0,denah:0})
    res.status(200).send(result)
})

module.exports = app