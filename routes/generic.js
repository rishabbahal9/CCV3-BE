const express=require('express')
const router=express.Router()

const genController=require('./../controller/generic')

// GET /generic/ece/embeddedSystems
router.get('/ece/:subjectName/:page',genController.getSubjectDocs)


module.exports=router