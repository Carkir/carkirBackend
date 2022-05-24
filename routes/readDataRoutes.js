const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const Item = require('../models/tempatModels')
const bodyParser = require('body-parser');
const res = require('express/lib/response');
const { json } = require('express/lib/response');
const  db  = require('../server')
const { count } = require('console')
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

app.get('/:tempatParkir', async(req,res)=>{
    const tempatParkir = req.params.tempatParkir
    const result = await Item.findOne({
        tempatParkir: `${tempatParkir}`
      })
    const output={
        tempatParkir: result.tempatParkir,
        address: result.tempatParkir,
        status: result.status,
        timeOpen: result.timeOpen,
        timeClose: result.timeClose,
        priceLow: result.priceLow,
        priceHigh: result.priceHigh,
        totalEmptySpace: result.totalEmptySpace,
        location: result.clusterCount
    }
    res.send(
        
        result.alamat
        ).status(201)
})

module.exports = app