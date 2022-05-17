const mongoose = require('mongoose')

const tempatSchema = new mongoose.Schema({
    namaTempat: {
        type: String,
        // required: true
    },
    thumbnail: {
        type: String,
        // required: true
    },
    totalTempatParkir: {
        type: String,
        // required: true
    },
    alamat: {
        type: String,
        // required: true
    },
    harga: {
        type: String,
        // required: true
    },
    waktuBuka: {
        type: String,
        // required: true
    },
},{strict:false})

const Item = mongoose.model('tempatParkir',tempatSchema)
module.exports = Item