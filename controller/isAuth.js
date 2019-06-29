const jwt=require('jsonwebtoken')

module.exports=(req,res,next)=>{
    console.log("AUTHORIZATION####################")
    console.log(req.get('Authorization'))
    var token=null;
    if(req.get('Authorization'))
    {
        token=req.get('Authorization').split(' ')[1];
    }    

        let decodedToken;
        try
        {
            decodedToken=jwt.verify(token,'youAlreadyKnowIwannaFuckyoukatrinakaifIamafuckingmultibillionaire');
        }
        catch(err)
        {
            err.statusCode=500;
            throw err;
        }
        if(!decodedToken)
        {
            const error=new Error('not authenticated');
            error.statusCode=401;
            throw error;
        }
        req.userId=decodedToken.userId;
        next()
    
    
}