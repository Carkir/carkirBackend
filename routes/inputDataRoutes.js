const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const _ = require('underscore')
const multer = require('multer')
const forms = multer()
const {inputDataFromJson} = require('../functions/input')
const {updateInfo} = require('../functions/update')
app.use(bodyParser.json())
app.use(forms.array())
app.use(bodyParser.urlencoded({extended:true}))


app.get('/input/:filename', (req, res) => {
  const filename = req.params.filename
  inputDataFromJson(filename)
  res.send('halo')
})

app.post('/update/:tempatParkir',(req,res) => {
  const tempatParkir = req.params.tempatParkir
  const hourOpen = req.body.hourOpen
  const hourClose = req.body.hourClose
  const minuteOpen = req.body.minuteOpen
  const minuteClose = req.body.minuteClose
  const priceHigh = req.body.priceHigh
  const priceLow = req.body.priceLow
  const alamat = req.body.alamat

  if(!tempatParkir || !hourOpen || !hourClose || !minuteOpen || !minuteClose || !priceHigh || !priceLow || !alamat){
    res.status(400).send('please fill all the required form')
  }else{
    try{
      updateInfo(tempatParkir,hourOpen,hourClose,minuteOpen,minuteClose,priceHigh,priceLow,alamat)
      res.send(`success updating ${tempatParkir}`)
    }catch(error){
      res.send(`failed to update info, reason : ${error}`).status(500)
    }

  }

})

module.exports = app