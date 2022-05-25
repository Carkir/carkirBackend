const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const bp = require('body-parser')
const multer = require('multer')
const forms = multer()
const {nanoid} = require('nanoid')
const {Credentials, Users} = require('../models/userModels')
const { response } = require('./readDataRoutes')
const regex = new RegExp('.*[A-Z\s].*')

app.use(bp.json())
app.use(bp.urlencoded({extended: true}))
app.use(forms.array())

app.post('/regPhase1',async(req,res)=>{
    const userId = nanoid(5)
    const username = req.body.username  

    if(!username){
        res.send('username cannot be empty').status(400)
        return
    }
    if(!username.match(regex)){
        res.send('username must cannot contains uppercase and whitespace!').status(400)
        return
    }

    try{
        const credentialResult = await Credentials.find({username : username})
        if(credentialResult.length > 0){
            res.send('username already taken!').status(409)
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
    const password = await bcrypt.hash(req.body.password,10)

    const credential = new Credentials({
        userId : userId,
        username: username,
        password : password
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

    const accountMatcher = await Credentials.findOne({username:username},{_id:0,username:1,password:1,userId:1})
    if (accountMatcher != null ){
        if(await bcrypt.compare(password,accountMatcher.password)){
            const account = await Users.findOne({userId : accountMatcher.userId},{_id:0,userId:1,email:1,name:1,adminStatus:1})
            res.send(account)
        }else{
            res.send(`username and password aren't match`)
        }
    }else{
        res.send(`username and password aren't match`)
    }
})

module.exports = app
