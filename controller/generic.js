const Doc=require('./../model/docs')

const ITEMS_PER_PAGE=9; 

exports.getSubjectDocs=(req,res,next)=>{
    const subject=req.params.subjectName;
    const page=req.params.page;
    var totalPages;

    Doc.find({subject: subject,authorized: true})
    .count()
    .then(totalDocs=>{
        totalPages=parseInt(totalDocs/ITEMS_PER_PAGE);
        if((totalDocs%ITEMS_PER_PAGE)>0)
        {
            totalPages++;
        }
        return Doc.find({subject: subject,authorized: true})
        .skip((page-1)*ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    })
    .then(docsArray=>{
        res.status(200).json({
            docsArray: docsArray,
            totalPages: totalPages
        })
    })
}
