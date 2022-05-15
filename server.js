const express = require('express')
const app = express()
const {Firestore} = require('@google-cloud/firestore')
const port = process.env.PORT || 8080
require('dotenv').config();
const router = require('./routes/testRoutes') 

app.use(express.static(__dirname+'public'))
app.use('/',router)


const firestore = new Firestore({})

app.listen(port,()=>{
    console.log(`Listening at ${port}`)
})