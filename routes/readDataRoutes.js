const express = require('express')
const app = express()
const Item = require('../models/tempatModels')
const bodyParser = require('body-parser');
const {findEmptySpace} = require('../functions/input')


app.use(bodyParser.json())

app.get('/tes/:tempatParkir/:floor', async (req, res) => {
  const tempatParkir = req.params.tempatParkir
  const floor = req.params.floor
  const cluster = req.params.cluster
  const slot = req.params.slot
  const result = await Item.find({
    tempatParkir: `${tempatParkir}`
  })
  const data = result[0].denah

  const filterDataByFloor = []
  data.forEach(element => {
    if(element.Floor == floor){
      filterDataByFloor.push(element)
    }
  });

  res.send(filterDataByFloor).status(201)
})

app.get('/allPlace',async(req,res)=>{
  res.send(await Item.find({},{_id:0,name:1,status:1,time:1,totalEmptySpace:1}))
})

app.get('/:tempatParkir', async(req,res)=>{
    const tempatParkir = req.params.tempatParkir
    const result = await Item.findOne({
        tempatParkir: `${tempatParkir}`
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