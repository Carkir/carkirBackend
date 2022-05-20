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

app.get('/:tempatParkir', async(req,res)=>{
    const tempatParkir = req.params.tempatParkir
    // const result = await Item.find({
    //   tempatParkir:`${tempatParkir}`
    // })
    const result = await Item.find({
        tempatParkir:`${tempatParkir}` , 
        denah:{$elemMatch:{Cluster:"A"}}},{_id:0,'denah.Cluster':1
      })
    function countCluster(){
        // let i =0
        // let count=0
        // while(i<result[0].denah.length){
        //     if(result[0].denah[i].Cluster=='A')
        //     count++
        //     i++
        // }
        // return count
    }
    console.log(countCluster())
    res.send(Object.values(result)).status(201)
})

module.exports = app