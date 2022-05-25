const express = require('express')
const mongoose = require('mongoose')
const app = express()
const {Firestore} = require('@google-cloud/firestore')
const port = process.env.PORT || 8080
const chokidar = require('chokidar')
const { dirname } = require('path')
require('dotenv').config();

const tes = require('./routes/testRoutes') 
const inputData = require('./routes/inputDataRoutes')
const imageData = require('./routes/imageRoutes') 
const readData = require('./routes/readDataRoutes') 
const authData = require('./routes/authRoutes')

//connect to db
mongoose.connect( `${process.env.CONNECTION_STRING}`,{
    useNewUrlParser : true,
    useUnifiedTopology : true
})

console.log(process.env.CONNECTION_STRING)
//display connection status
const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', ()=>{console.log("connection success")})

app.use(express.static(__dirname+'public'))
app.use('/',tes)
app.use('/input',inputData)
app.use('/image',imageData)
app.use('/read',readData)
app.use('/auth',authData)
app.use(express.static(dirname+'Documentsl'))

const firestore = new Firestore({})

app.listen(port,()=>{
    console.log(`Listening at ${port}`)
})





module.exports = db