const express=require('express')
const router=express.Router()
const isAuth=require('./../controller/isAuth')

const genController=require('./../controller/generic')

// GET /generic/
router.get('/searched/:searchedString/:page',genController.getSearchedDocs)
router.get('/:subjectName/:page',genController.getSubjectDocs)


module.exports=router