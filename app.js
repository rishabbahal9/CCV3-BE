//26th May 2019; 12:48PM;Rishab Bahal
//Designing backend API for coconutcV3
const https=require('https')
const fs=require('fs')

const dotenv=require('dotenv')
dotenv.config()
const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const swaggerUi=require('swagger-ui-express')

const swaggerDocument=require('./util/swagger.json')
const authRoute=require('./routes/auth')
const genericRoute=require('./routes/generic')

const mongodb_url=process.env.MONGODB_URL

const options = {
    key: fs.readFileSync('./certificates/server-key.pem'),
    cert: fs.readFileSync('./certificates/server-cert.pem'),
};

const app=express()
app.use(express.static('./UploadedDOCS'))


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

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument))

app.use('/generic',genericRoute)
app.use('/auth',authRoute)


app.use((req,res,next)=>{
    res.send("Error 404:page not found!")
})

const PORT=process.env.PORT;
mongoose.connect(mongodb_url,{useNewUrlParser: true})
.then(()=>{
    https.createServer(options, app).listen(PORT, ()=>{
        console.log(`Server listening on port ${PORT}`);
    });
    // app.listen(process.env.PORT);console.log(`Listening to port ${process.env.PORT}...`)
})
.catch((err)=>{console.log(err)})

// app.listen(3000,(err)=>{
//     if(!err)
//         console.log("Listening to port 3000...")
// })

