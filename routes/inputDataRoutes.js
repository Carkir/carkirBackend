const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const _ = require('underscore')
const {inputDataFromJson} = require('../functions/input')
const {updateInfo} = require('../functions/update')
const {verifyToken} = require('../functions/tokenize')
const cp = require('cookie-parser')



app.use(bodyParser.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({limit:'50mb',extended:true, parameterLimit:50000}))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(cp())


app.get('/input/:filename', verifyToken,(req, res) => {
  if(req.user.mlInbound != null && Boolean(req.user.mlInbound) != true) return res.sendStatus(401)
  if( req.user.masterAdmin!= null && Boolean(req.user.masterAdmin)!= true) return res.sendStatus(403)

  const filename = req.params.filename
  inputDataFromJson(filename)
  res.send('halo')
})

app.post('/update/:tempatParkir', verifyToken, async(req,res) => {
  if( req.user.masterAdmin!= null && Boolean(req.user.masterAdmin)!= true) return res.sendStatus(403)
  if( req.user.isAndroid!= null && Boolean(req.user.isAndroid)!= true) return res.sendStatus(403)

  const tempatParkir = req.params.tempatParkir
  const timeOpen= Number(req.body.timeOpen)
  const timeClose = Number(req.body.timeClose)
  const priceHigh = Number(req.body.priceHigh)
  const priceLow = Number(req.body.priceLow)
  const alamat = req.body.alamat
  const image = req.body.image

  const open = new Date(timeOpen)
  const close = new Date(timeClose)
  const hourOpen = open.getHours()
  const hourClose = close.getHours()
  const minuteOpen = open.getMinutes()
  const minuteClose = close.getMinutes()

  console.log(
    `tempatParkir:${tempatParkir}\n
    hourOpen:${hourOpen}\n
    hourClose:${hourClose}\n
    minuteOpen:${minuteOpen}\n
    minuteClose:${minuteClose}\n
    priceHigh:${priceHigh}\n
    priceLow:${priceLow}\n
    alamat:${alamat}\n
    image: ${image}`)


  if(!hourOpen || !hourClose){
    console.log('waduh')
    res.status(400).send('please fill all the required form')
  }else{
    try{
      updateInfo(tempatParkir,hourOpen,hourClose,minuteOpen,minuteClose,priceHigh,priceLow,alamat,image)
      console.log('success')
      res.send(`success updating ${tempatParkir}`)
    }catch(error){
      console.log(`failed to update info, reason : ${error}`)
      res.send(`failed to update info, reason : ${error}`).status(500)
    }

  }

})

module.exports = app