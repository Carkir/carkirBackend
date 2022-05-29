const express = require('express')
const app = express() 
const multer = require('multer')  
const fileupload = require('express-fileupload')
const fs = require('fs')
const {Client} = require('pg')
const { json } = require('express/lib/response')

const client = new Client({
    host : 'localhost',
    user: 'postgres',
    database: 'base64',
    port : 5432
})

client.connect((err)=>{
    if(err){
        console.log(err)
        return
    }
    console.log('client connected')
})
// app.use(upload.array())
app.use(express.static(__dirname + 'convert'))
app.use(fileupload())

app.post('/convert', async (req,res)=>{
    if(!req.files){
        console.log('file not found')
        return
    }
    const file = req.files.Image.data.toString('base64')
    await client.query(`INSERT INTO base64(base64) VALUES($1)`,[file],(err)=>{
        if(err){
            res.send(err)
            return
        }
        res.send('success')
    })
    
})

app.get('/',(req,res)=>{
    client.query(`select * from base64`,[],(err,result)=>{
        res.send(result.rows)
    })
})

app.get('/:id',(req,res)=>{
    client.query(`select * from base64 where id=$1`,[req.params.id],(err,result)=>{
        res.send(result.rows)
    })
})

app.get('/image/:id',async(req,res)=>{
    client.query(`SELECT base64 from base64 where id = $1`,[req.params.id],(err,result)=>{
        const mimeType = 'image/png'
        res.send(`<img src="data:${mimeType};base64,${result.rows[0].base64}" />`);
    })
})

app.listen(5000,()=>{
    console.log('successfully listen at 5000')
})