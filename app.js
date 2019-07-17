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
app.use(express.static('./UploadedDOCS'))
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
            return cb({message:'Only pdfs are allowed'},false)
        }
        return cb(null, true)
}



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
var upload=multer({storage: fileStorage,fileFilter:fileFilter, limits: { fileSize: 80*1024*1024 }})
app.post('/uploadDocs',upload.single('file'),(req,res,next)=>{
    console.log("File uploaded successfully using multer:) "+new Date())
    console.log("req.file:")
    console.log(req.file)
    res.status(200).json({ msg: "File uploaded successfully!", filename: req.file.filename, originalname: req.file.originalname })
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

