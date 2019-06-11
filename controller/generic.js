const Doc=require('./../model/docs')

exports.getSubjectDocs=(req,res,next)=>{
    const subject=req.params.subjectName;
    Doc.find({subject: subject,authorized: true})
    .then(docsArray=>{
        res.status(200).json({docsArray: docsArray})
    })
}
