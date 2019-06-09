const express=require('express')
const router=express.Router()

const authController=require('./../controller/auth')

// POST /auth/signup
router.post('/signup',authController.postSignup)
// POST /auth/login
router.post('/login',authController.postLogin)
//PATCH /auth/userAuthentication/:ObjectID
router.patch('/userAuthentication/:ObjectID',authController.patchUserAuthenticated)

module.exports=router