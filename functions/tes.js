const Item = require('../models/tempatModels')
const _ = require('underscore')
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();

async function tescount(filename) {
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
      
  }

  module.exports= {tescount}