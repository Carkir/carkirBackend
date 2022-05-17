const express = require('express')
const mongoose = require('mongoose')
const app = express()
const {Firestore} = require('@google-cloud/firestore')
const port = process.env.PORT || 8080
require('dotenv').config();
const tes = require('./routes/testRoutes') 
const inputData = require('./routes/inputDataRoutes') 

//connect to db
mongoose.connect( process.env.CONNECTION_STRING,{
    useNewUrlParser : true,
    useUnifiedTopology : true
})

//display connection status
const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', ()=>{console.log("connection success")})

app.use(express.static(__dirname+'public'))
app.use('/',tes)
app.use('/read',inputData)

const firestore = new Firestore({})

app.listen(port,()=>{
    console.log(`Listening at ${port}`)
})

module.exports = db