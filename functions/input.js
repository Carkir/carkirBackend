const Item = require('../models/tempatModels')
const _ = require('underscore')
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();

async function inputDataFromJson(filename) {
    bucketName = 'carkir-storage'
    const nameExtension = filename + '.json'
    const contents = await storage.bucket(bucketName).file(nameExtension).download();
    
    const result = await Item.findOne({
      tempatParkir: `${filename}`
    })
  
    if(result){
      console.log('Waduh ada')
      const totalObject = await findEmptySpace(filename)
      const totalValue = Number(totalObject.total)
      
      await Item.updateOne(
        { tempatParkir: filename },
        { $set: {
            denah: JSON.parse(contents),
            totalEmptySpace: totalValue
          }
        }
      )
      countCluster(filename)
      return
    }
    const placeName = filename.split('_').join(' ')
    const item = new Item({
      tempatParkir: filename,
      name: placeName.toString(),  
      alamat: '',
      priceLow: 1000,
      priceHigh: 10000,
      timeOpen : 1655769600000,
      timeClose : 1655805600000,
      time: '10.00 WIB - 17.00 WIB',
      status : '',
      totalEmptySpace: 0,
      denah: JSON.parse(contents)
    })
    await item.save()
    countCluster(filename)
  }
  
  async function countCluster(filename) {
    bucketName = 'carkir-storage'
    const nameExtension = filename + '.json'
    const contents = await storage.bucket(bucketName).file(nameExtension).download();
    let floor = 1
    const data = JSON.parse(contents)
    const output = []
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

    for (const [key, value] of Object.entries(result)) {
      output.push(`${key}`+''+ `${value}`)
    }

    await Item.updateOne({ tempatParkir: filename },
      { $set: {
          clusterCount: output
        }
      })
  }

  async function findEmptySpace(tempatParkir){
    const a = await Item.aggregate([{
      $unwind:{ 
        path: '$denah',
        includeArrayIndex: "arrayIndex"}},
      {$match:{
        tempatParkir: tempatParkir,
        'denah.Occupancy':1
      }},
    {$group: {
      '_id':0,
      total:{
        $sum:1
      }
    }},
  {$project:{
    _id:0
  }}])
  console.log(a[0])
    return a[0]
  }

  module.exports= {inputDataFromJson, countCluster, findEmptySpace,}