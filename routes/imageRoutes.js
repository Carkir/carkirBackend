const express = require('express')
const app = express()
const fs = require('fs')
const fileupload = require('express-fileupload')
const Item = require('../models/tempatModels')

app.use(fileupload())

app.post('/convert/:id',async(req,res)=>{
    const id = req.params.id.toString()
    const image = req.files.image
    await Item.updateOne({tempatParkir:id},{
        $set:{
            headerImage:image.data.toString('base64')
        }
    })
    res.send(id)  
})

app.get('/getheader/:id',async(req,res)=>{
    const id = req.params.id.toString()
    const result = await Item.find({tempatParkir:id},{_id:0,headerImage:1})
    if(result.length == 0){
        res.send('cannot find image by that id')
    }else{
        const mimeType ='image/png'
        res.send(`<img src="data:${mimeType};base64,${result[0].headerImage}" />`)
    }
})

module.exports = app
