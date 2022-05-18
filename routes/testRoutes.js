const express = require('express')
const app = express()
// const router = express.Router()

app.get('/',(req,res)=>{
    res.redirect('You are successfully connect to API!')
})

module.exports = app