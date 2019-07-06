const express=require('express')
const router=express.Router()

const isAuth=require('./../controller/isAuth')
const authController=require('./../controller/auth')

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

module.exports=router