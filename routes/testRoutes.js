const express = require('express')
const app = express()
// const router = express.Router()

app.get('/',(req,res)=>{
    res.send('Tes Get Home')
})

module.exports = app