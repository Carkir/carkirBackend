const express = require('express')
const app = express()
const Item = require('../models/tempatModels')
const bodyParser = require('body-parser');
const {findEmptySpace} = require('../functions/input')
const {verifyToken} = require('../functions/tokenize')


app.use(bodyParser.json())

app.get('/Occupancy/:name/:floor',verifyToken, async (req, res) => {
  if(Boolean(req.user.isAndroid)!=true) res.sendStatus(401)
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

  filterDataByFloor.unshift(Occupancy)
  res.status(201).send(filterDataByFloor)
})

app.get('/allPlace',verifyToken,async(req,res)=>{
  if(Boolean(req.user.isAndroid)!=true) res.sendStatus(401)
  res.send(await Item.find({},{_id:0,name:1,status:1,time:1,totalEmptySpace:1}))
})

app.get('/:name', verifyToken,async(req,res)=>{
    if(Boolean(req.user.isAndroid)!=true) res.sendStatus(401)
    const name = req.params.name
    const result = await Item.findOne({
      name: `${name}`
      })
    const output={
        name: result.name,
        address: result.address,
        status: result.status,
        time: result.time,
        priceLow: result.priceLow,
        priceHigh: result.priceHigh,
        totalEmptySpace: result.totalEmptySpace,
        location: result.clusterCount
    }
    res.status(201).send(output)
})

module.exports = app