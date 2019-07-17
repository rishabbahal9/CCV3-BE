const express=require('express')
const router=express.Router()

const multer=require('multer')
const isAuth=require('./../controller/isAuth')
const authController=require('./../controller/auth')


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
var upload=multer({storage: fileStorage,fileFilter:fileFilter, limits: { fileSize: 80*1024*1024 }})


// POST /auth/signup
router.post('/signup',authController.postSignup)
// POST /auth/login
router.post('/login',authController.postLogin)
//PATCH /auth/userAuthentication/:ObjectID
router.patch('/userAuthentication/:ObjectID',authController.patchUserAuthenticated)
// POST /auth/forgotPassword
router.post('/forgotPassword',authController.forgotPassword)
// POST auth/resetPassword
router.post('/resetPassword',authController.resetPassword)
// POST auth/resetPasswordSubmit
router.post('/resetPasswordSubmit',authController.resetPasswordSubmit)
// POST auth/changePasswordSubmit
router.post('/changePasswordSubmit',isAuth,authController.changePasswordSubmit)
// POST auth/updateProfileSubmit
router.post('/updateProfileSubmit',isAuth,authController.updateProfileSubmit)
// POST auth/docUploadFormSubmit
router.post('/docUploadFormSubmit',isAuth,authController.docUploadFormSubmit)
// POST auth/uploadDocs
router.post('/uploadDocs',upload.single('file'),authController.docUpload)

module.exports=router