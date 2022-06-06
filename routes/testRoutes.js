const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const bp = require('body-parser')
const {createToken} = require('../functions/tokenize')
// const router = express.Router()
const axios = require('axios').default

app.use(express.json())
app.use(bp.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    axios.get('https://google.com').then(
        (response)=>{
            res.send(response.status)
        })
     })

app.post('/tokenizable',(req,res)=>{
    const data = req.body
    res.send(createToken(data))

})

module.exports = app