const express = require('express')
const app = express()
const Item = require('../models/tempatModels')
const bodyParser = require('body-parser');
const {findEmptySpace} = require('../functions/input')


app.use(bodyParser.json())

app.get('/tes/:tempatParkir&:floor&:cluster&:slot', async (req, res) => {
    const tempatParkir = req.params.tempatParkir
    const floor = req.params.floor
    const cluster = req.params.cluster
    const slot = req.params.slot
    const result = await Item.find({
      tempatParkir: `${tempatParkir}`,
      denah: { $elemMatch: { Floor: Number(floor), Cluster: `${cluster}`, Slot: Number(slot) } }
    }, {
      _id: 0, "denah.Occupancy.$": 1
    })
    res.send(Object.values(result[0].denah[0])).status(201)
})

app.get('/allPlace',async(req,res)=>{
  res.send(await Item.find({},{_id:0,name:1,status:1,time:1,totalEmptySpace:1})).status(200)
})

app.get('/:tempatParkir', async(req,res)=>{
    const tempatParkir = req.params.tempatParkir
    const result = await Item.findOne({
        tempatParkir: `${tempatParkir}`
      })
    const output={
        name: result.name,
        address: result.tempatParkir,
        status: result.status,
        time: result.time,
        priceLow: result.priceLow,
        priceHigh: result.priceHigh,
        totalEmptySpace: result.totalEmptySpace,
        location: result.clusterCount
    }
    res.send(output).status(201)
})

module.exports = app