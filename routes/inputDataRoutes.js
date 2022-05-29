const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const _ = require('underscore')
const multer = require('multer')
const forms = multer()
const {inputDataFromJson} = require('../functions/input')
const {updateInfo} = require('../functions/update')
const {verifyToken} = require('../functions/tokenize')
const fileupload = require('express-fileupload')
const cp = require('cookie-parser')



app.use(bodyParser.json())
app.use(cp())
app.use(fileupload())

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
  const hourOpen = req.body.hourOpen
  const hourClose = req.body.hourClose
  const minuteOpen = req.body.minuteOpen
  const minuteClose = req.body.minuteClose
  const priceHigh = req.body.priceHigh
  const priceLow = req.body.priceLow
  const alamat = req.body.alamat
  const image = req.files.Image.data


  if(!tempatParkir || !hourOpen || !hourClose || !minuteOpen || !minuteClose || !priceHigh || !priceLow || !alamat || !image){
    res.status(400).send('please fill all the required form')
  }else{
    try{
      updateInfo(tempatParkir,hourOpen,hourClose,minuteOpen,minuteClose,priceHigh,priceLow,alamat,image)
      res.send(`success updating ${tempatParkir}`)
    }catch(error){
      res.send(`failed to update info, reason : ${error}`).status(500)
    }

  }

})

module.exports = app