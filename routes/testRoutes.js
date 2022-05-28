const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const bp = require('body-parser')
const {createToken} = require('../functions/tokenize')
// const router = express.Router()

app.use(express.json())
app.use(bp.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.send('You are successfully connect to API!')
})

app.post('/tokenizable',(req,res)=>{
    const data = req.body
    res.send(createToken(data))

})

module.exports = app