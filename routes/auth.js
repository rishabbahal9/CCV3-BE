const express=require('express')
const router=express.Router()
const multer=require('multer')
var aws = require('aws-sdk')
const multerS3 = require('multer-s3')

aws.config.update({
    secretAccessKey: 'osgc0t/tKMYeewPIbzCYfoyl0ZWbdvWt5nfjWbkr',
    accessKeyId: 'AKIAIBVS4ZVN4SNYCKIA',
    region: 'ap-south-1'
});
var s3 = new aws.S3()


const isAuth=require('./../controller/isAuth')
const authController=require('./../controller/auth')


const fileStorage=multerS3({
    s3: s3,
    bucket: 'coconutc-docs',
    acl: 'public-read',
    key: function (req, file, cb) {
        console.log(file);
        var newFileName=new Date().toDateString()+'-'+new Date().getTime()+'-'+file.originalname;
        var fullPath="docs/"+newFileName
        cb(null,fullPath);
    },
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
// GET auth/admin/unauthDocs
router.get('/admin/unauthDocs/:page',isAuth,authController.getUnauthDocs)
// POST auth/admin/authorizeDoc
router.post('/admin/authorizeDoc',isAuth,authController.authorizeDoc)
// POST auth/admin/rejectDoc
router.post('/admin/rejectDoc',isAuth,authController.rejectDoc)

module.exports=router