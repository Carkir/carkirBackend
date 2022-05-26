const jwt = require('jsonwebtoken')

function createToken(){}

function verifyToken(req, res, next){
    const autHeader = req.headers['authorization']
    const token = autHeader && autHeader.split(' ')[1]
    if(token == null) return res.sendStatus(403)
    jwt.verify(token,`${process.env.SECRET_KEY}`,(err,user)=>{
        if(err) return res.sendStatus(401)
        req.user = user
        next()
    })

}

module.exports = {verifyToken}