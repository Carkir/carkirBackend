const res = require('express/lib/response')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const cp = require('cookie-parser')
const express = require('express')
const app = express()

app.use(cp())

function createToken(data){
    return {
        accessToken : jwt.sign(data,process.env.SECRET_KEY)
    }
}

function verifyToken(req, res, next){
    if(req.headers.authorization == null || req.headers.authorization == undefined){
        req.headers.authorization =  `Bearer ${req.cookies.auth}`  
    } 
    const autHeader = req.headers['authorization']
    const token = autHeader && autHeader.split(' ')[1]

    if(token == null) return res.sendStatus(403)
    
    jwt.verify(token,`${process.env.SECRET_KEY}`,(err,user)=>{
        if(err) return res.sendStatus(401)
        req.user = user
        next()
    })

}

module.exports = {createToken,verifyToken}