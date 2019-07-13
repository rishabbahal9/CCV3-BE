//26th May 2019; 12:48PM;Rishab Bahal
//Designing backend API for coconutcV3
const http=require('http')

const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const multer=require('multer')

const authRoute=require('./routes/auth')
const genericRoute=require('./routes/generic')

// const mongodb_url="mongodb+srv://coconutAdmin:bTJPb4kC9usAmqve@rishab999-nhaqy.mongodb.net/coconutc"
const mongodb_url="mongodb://127.0.0.1:27017/coconutc"
const app=express()
const fileStorage=multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./UploadedDOCS')
    },
    filename: (req,file,cb)=>{
        console.log("OriginalName")
        console.log(file.originalname)
        cb(null,new Date().toDateString()+'-'+new Date().getTime()+'-'+file.originalname)
    }
})
const fileFilter=(req,file,cb)=>{
        console.log("File mimetype")
        console.log(file.mimetype)
        console.log(file)
        if (file.mimetype != 'application/pdf') 
        {
            return cb(new Error('Only pdfs are allowed'))
        }
  
        return cb(null, true)
}
var uploadD=multer({storage: fileStorage,fileFilter:fileFilter, limits: { fileSize: 80*1024*1024 }}).single('file')
app.use(bodyParser.json())

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,PATCH')
    res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Authorization,Accept')
    next()
})



app.use((req,res,next)=>{
    const url=req.url;
    console.log("Request: "+url)
    next()
})

app.use('/uploadDocs',(req,res,next)=>{
    console.log("Reached here!!!")
    uploadD(req,res,function(err){
        if(err)
        {
            console.log("Reached here2!!!")
            console.log(err)
            return res.status(501).json({error: err})
        }
        console.log("Reached here3!!!")
        return res.status(200).json({msg: "successfully uploaded!"}) 
    })
})

app.use('/generic',genericRoute)
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

