const mongoose = require('mongoose')

const credentialSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    username : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    }
})

const userSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    adminStatus: {
        type: Boolean,
        required: true
    }
})

const Credentials = mongoose.model('credentials',credentialSchema)
const Users = mongoose.model('users',userSchema)

module.exports = {Credentials, Users}