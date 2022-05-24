const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const Item = require('../models/tempatModels')
const bodyParser = require('body-parser');
const res = require('express/lib/response');
const { json } = require('express/lib/response');
const db = require('../server')
const _ = require('underscore')
const { isMapIterator } = require('util/types')
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const https= require('https');

app.use(bodyParser.json())

app.get('/:tempatParkir&:floor&:cluster&:slot', async (req, res) => {
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

app.get('/cloud/:filename', async(req,res)=>{
  const filename = req.params.filename
  readFromCloudStorage(filename)
  res.send('halo')
});

async function readFromCloudStorage(filename){
  bucketName = 'carkir-storage'
  const nameExtension = filename + '.json'
  const contents = await storage.bucket(bucketName).file(nameExtension).download();
    let floor = 1
    const data = JSON.parse(contents)
    const result = _.countBy(data, function (data1) {
      if (data1.Floor == floor){
        if (data1.Occupancy == 1.0) {
          let i = data1.Floor + "" + data1.Cluster
          return i;
        }
      } else {
        floor = data1.floor
        if (data1.Occupancy == 1.0){
          let i = data1.Floor + "" + data1.Cluster
          return i;
        }
      }
    })
  await Item.updateOne({ tempatParkir: filename },
    { $set: {
        clusterCount: result
      }
    })
}

app.get('/input/:filename', (req, res) => {
  const filename = req.params.filename
  inputDataFromJson(filename)
  countCluster(filename)
  res.send('halo')
})

async function inputDataFromJson(filename) {
  bucketName = 'carkir-storage'
  const nameExtension = filename + '.json'
  const contents = await storage.bucket(bucketName).file(nameExtension).download();

  const result = await Item.findOne({
    tempatParkir: `${filename}`
  })

  if(result){
    await Item.updateOne(
      { tempatParkir: filename },
      { $set: {
          denah: JSON.parse(contents)
        }
      }
    )
    return
  }

  const item = new Item({
    tempatParkir: filename,
    headerImage: null,
    alamat: null,
    denah: JSON.parse(contents)
  })
  await item.save()
}

async function countCluster(filename) {
  bucketName = 'carkir-storage'
  const nameExtension = filename + '.json'
  const contents = await storage.bucket(bucketName).file(nameExtension).download();
    let floor = 1
    const data = JSON.parse(contents)
    const result = _.countBy(data, function (data1) {
      if (data1.Floor == floor){
        if (data1.Occupancy == 1.0) {
          let i = data1.Floor + "" + data1.Cluster
          return i;
        }
      } else {
        floor = data1.floor
        if (data1.Occupancy == 1.0){
          let i = data1.Floor + "" + data1.Cluster
          return i;
        }
      }
    })
  await Item.updateOne({ tempatParkir: filename },
    { $set: {
        clusterCount: result
      }
    })
}
module.exports = app