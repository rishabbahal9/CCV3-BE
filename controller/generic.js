const Doc=require('./../model/docs')

const ITEMS_PER_PAGE=parseInt(process.env.ITEMS_PER_PAGE_GENERIC); 

exports.getSubjectDocs=(req,res,next)=>{
    const university=req.params.university;
    const course=req.params.course;
    const stream=req.params.stream;
    const subject=req.params.subject;
    const page=req.params.page;

    // console.log("university,course,stream,subject");

    var totalPages;
    var totalD;

    Doc.find({
        // university: university, 
        // course: course, 
        // stream: stream, 
        subject: subject, 
        authorized: true,
        rejected: false})
    .countDocuments()
    .then(totalDocs=>{
        totalD=totalDocs;
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
        console.log("DOCS Array:-")
        console.log(docsArray)
        res.status(200).json({
            docsArray: docsArray,
            totalPages: totalPages,
            totalDocs: totalD
        })
    })
}


exports.getSearchedDocs=(req,res,next)=>{
    // console.log("Reached SEARCHED CONTROLLER")

    const searchedString=req.params.searchedString;
    const page=req.params.page;
    var totalPages;
    var totalD;
    Doc.find({$text: {$search: searchedString},authorized: true,rejected: false})
    .countDocuments()
    .then(totalDocs=>{
        totalD=totalDocs;
        totalPages=parseInt(totalDocs/ITEMS_PER_PAGE);
        if((totalDocs%ITEMS_PER_PAGE)>0)
        {
            totalPages++;
        }
        return Doc.find({$text: {$search: searchedString},authorized: true,rejected: false},{score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})
        .skip((page-1)*ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    })
    .then(docsArray=>{
        // console.log("DOCS Array:-")
        // console.log(docsArray)
        res.status(200).json({
            docsArray: docsArray,
            totalPages: totalPages,
            totalDocs: totalD
        })
    })
}