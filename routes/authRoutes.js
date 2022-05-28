const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const bp = require('body-parser')
const multer = require('multer')
const forms = multer()
const {nanoid} = require('nanoid')
const {Credentials, Users} = require('../models/userModels')
const usernameRegex = new RegExp('.*[A-Z\\s]+')
const passwordRegex = new RegExp('^[A-Za-z][A-Za-z0-9]*$')
const emailChecker = require('email-validator')
const jwt = require('jsonwebtoken')
const cp = require('cookie-parser')

require('dotenv').config()

app.use(bp.json())
app.use(bp.urlencoded({extended: true}))
app.use(forms.array())
app.use(cp())

app.post('/regPhase1',async(req,res)=>{
    const userId = nanoid(5)
    const username = req.body.username  

    if(!username){
        res.status(400).send('username cannot be empty')
        return
    }
    if(usernameRegex.test(username)){
        res.status(400).send('username cannot contains uppercase and whitespace!')
        return
    }

    if(username == `${process.env.MASTER_USER}`) res.status(409).send('username already taken!')

    try{
        const credentialResult = await Credentials.find({username : username})
        if(credentialResult.length > 0){
            res.status(409).send('username already taken!')
        }else{
            res.send({
                userId: userId,
                username: username
            })
        }
    }catch(error){
        console.log(error)  
        res.send('Fail to register')
    }

})

app.post('/regFinal',async(req,res)=>{
    const userId = req.body.userId
    const username = req.body.username
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    if(!userId || !username || !name || !email || !password){
        res.status(401).send('please fill all required form')
        return
    }

    if(!emailChecker.validate(email)){
        res.status(401).send('please insert valid email format')
        return
    }

    if(!passwordRegex.test(password)){
        res.status(401).send('password cannot contain whitespace')
        return
    }

    const credential = new Credentials({
        userId : userId,
        username: username,
        password : await bcrypt.hash(password,10)
    })

    const user = new Users({
        userId: userId,
        name: name,
        email : email,
        adminStatus : false
    })

    try{
        credential.save()
    }
    catch(error){
        res.send(error)
        return
    }
    try{
        user.save()
    }
    catch(error){
        res.send(error)
        return
    }
    res.send('success saving account !')

})

app.post('/login',async(req,res)=>{
    const username = req.body.username
    const password = req.body.password

    console.log(`${username}\n${password}`)
    

    if(username=='' && await bcrypt.compare(password,`${process.env.MASTER_PASSWORD}`) == true){
        const data = {
            masterAdmin : true
        }
        const token = jwt.sign(data, process.env.SECRET_KEY, {expiresIn : '30m'})
        res.cookie('auth', token).send('success')
        return console.log(req.cookies.auth)
        
    }

    if(!username || !password){
        res.status(400).send('please fill all require form : username and password')
        return
    }

    const accountMatcher = await Credentials.findOne({username:username},{_id:0,username:1,password:1,userId:1})
    if (accountMatcher != null ){
        if(await bcrypt.compare(password,accountMatcher.password)){
            const account = await Users.findOne({userId : accountMatcher.userId},{_id:0,userId:1,email:1,name:1,adminStatus:1})
            const token = jwt.sign(account,process.env.SECRET_KEY,{expiresIn : '30m'})
            res.cookie('auth',token).sendStatus(200)
        }else{
            res.status(401).send(`username and password aren't match`)
        }
    }else{
        res.status(401).send(`username and password aren't match`)
    }
})

app.post('/',(req,res)=>{
    res.status(400).send('error')
})

module.exports = app
