const express=require('express')
const router=express.Router()
const isAuth=require('./../controller/isAuth')

const genController=require('./../controller/generic')

// GET /generic/ece/embeddedSystems
router.get('/:subjectName/:page',genController.getSubjectDocs)


module.exports=router