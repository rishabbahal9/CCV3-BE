//26th May 2019; 12:48PM;Rishab Bahal
//Designing backend API for coconutcV3
const http=require('http')

const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')

const authRoute=require('./routes/auth')

const mongodb_url="mongodb+srv://coconutAdmin:bTJPb4kC9usAmqve@rishab999-nhaqy.mongodb.net/coconutc"
const app=express()

app.use(bodyParser.json())

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,PATCH')
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization')
    next()
})

app.use((req,res,next)=>{
    const url=req.url;
    console.log("Request: "+url)
    next()
})

app.use('/auth',authRoute)

app.use((req,res,next)=>{
    res.send("Error 404:page not found!")
})

mongoose.connect(mongodb_url,{useNewUrlParser: true})
.then(()=>{app.listen(3000)})
.catch((err)=>{console.log(err)})

// app.listen(3000,(err)=>{
//     if(!err)
//         console.log("Listening to port 3000...")
// })

