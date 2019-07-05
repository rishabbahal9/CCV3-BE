const bcrypt=require('bcryptjs')
const User=require('./../model/user')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')

const nodemailer=require('nodemailer')
const sendgridTransport=require('nodemailer-sendgrid-transport')

const transporter=nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: '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'
        }
    })
)


exports.postSignup=(req,res,next)=>{
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const gender=req.body.gender;
    const email=req.body.email;
    var password=req.body.password;
    const imgUrl=req.body.imgUrl;
    const dateCreated=Date.now()
    
    //Encrypting password
    bcrypt.hash(password,12)
    .then(hashedPassword=>{
        const user=new User({
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            email:email,
            password: hashedPassword,
            imgUrl: imgUrl,
            emailVerified: false,
            dateCreated:dateCreated,
            pwdToken: null,
            pwdTokenExp: null
            })

            User.findOne({email: email})
            .then(userStored=>{
                // console.log("userStored")
                // console.log(userStored)
                if(!userStored)
                {
                    user.save()
                    .then(result=>{
                        // console.log(result)
                        res.status(201).json({msg: 'Details successfully stored! A link has been sent to your email, click the link to verify your email. (Mail might be stored in spam section)',user: {}})
                        // console.log("Result")
                        // console.log(result._id)
                        transporter.sendMail({
                            to: result.email,
                            from: 'coconut8catalogue@gmail.com',
                            subject: 'Email verify: Coconut Catalogue',
                            html: `
                            <h1>Email verify</h1>
                            <p>Click the link below to verify your email..
                            </p>
                            <a href="http://127.0.0.1:4200/emailVerify/${result._id}">Verify</a>
                            `
                        })
                    })
                    .catch(err=>{
                        console.log(err)
                        res.status(501).json({msg: 'Error: cannot save data',user: {}})
                    })
                    
                }
                else
                {
                    res.status(401).json({msg: "Email already exists", user: {}})
                }
            
            })

    })

}


exports.postLogin=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;

    User.findOne({email: email})
    .then(user=>{
        // console.log(user)
        if(!user)
            res.status(401).json({msg: "Email not found",token: null, expiresIn: null})
        else
        {
            bcrypt.compare(password,user.password)
            .then(
                doMatch=>{
                    if(!doMatch)
                    {
                        res.status(401).json({msg: "Incorrect password",token: null, expiresIn: null})
                    }
                    else
                    {
                            const token=jwt.sign(
                                {
                                    firstName: user.firstName, 
                                    lastName: user.lastName, 
                                    email: user.email, 
                                    gender: user.gender, 
                                    imgUrl: user.imgUrl, 
                                    dateCreated: user.dateCreated, 
                                    starred: user.starred, 
                                    uploaded: user.uploaded, 
                                    emailVerified: user.emailVerified,
                                    pwdToken: user.pwdToken,
                                    pwdTokenExp: user.pwdTokenExp
                                },
                                'youAlreadyKnowIwannaFuckyoukatrinakaifIamafuckingmultibillionaire',
                                {expiresIn: '1h'}
                            )

                            res.status(200).json(
                                    {msg: "Logged In successfully",token: token, expiresIn: 3600*1000}
                                )
                    }
                }
            )
        }
    })
}

exports.patchUserAuthenticated=(req,res,next)=>{
    const id=req.params.ObjectID;
    User.findOne({_id: id})
    .then(user=>{
        if(!user)
        {
            res.status(400).json({msg: "Email can't be verified!"})
        }
        if(user)
        {
            user.emailVerified=true;
            user.save()
            res.status(202).json({msg: "Email verified! Now go to login."})
        }
    })
    .catch(err=>{console.log(err)})
}

exports.forgotPassword=(req,res,next)=>{
    const email=req.body.email;

    User.findOne({email: email})
    .then(userStored=>{
        console.log("userStored")
        console.log(userStored)
        if(!userStored)
        {
            res.status(406).json({msg: `Email ${email} is not registered with us.`})
        }
        crypto.randomBytes(32,(err,buffer)=>{
            if(err)
            {
                return console.log(err)
            }
            const token=buffer.toString('hex')
            console.log(token)
            userStored.pwdToken=token
            userStored.pwdTokenExp=new Date(new Date().getTime()+3600000)
            userStored.save()
            return transporter.sendMail({
                to: userStored.email,
                from: 'coconut8catalogue@gmail.com',
                subject: 'Reset password: Coconut Catalogue',
                html: `
                <h1>Reset password link</h1>
                <p>Go to the below link to reset password:-<br>
                Link will expire after 1 hour.
                </p>
                <a href="http://127.0.0.1:4200/user/resetPassword/${userStored.pwdToken}">Reset password</a>
                `
            })
        })
        
        res.status(200).json({msg: `Email with the password reset link has been sent to ${email}. Link will expire after 1 hour.`})
    })
    .catch(err=>{
        console.log(err)
        res.status(406).json({msg: `Some error occured!`})
    })
}

exports.resetPassword=(req,res,next)=>{
    const pwdToken=req.body.pwdToken;
    User.findOne({pwdToken:pwdToken})
    .then(
        user=>{
            console.log("Accessing backend data:")
            console.log(user.pwdToken)
            console.log(user.pwdTokenExp.getTime())
            console.log(new Date().getTime())
            if(user.pwdToken==pwdToken)
            {
                if(new Date().getTime()<user.pwdTokenExp.getTime())
                {
                    return res.status(200).json({authorized: true,msg: user.email})
                }
                else
                {
                    return res.status(408).json({authorized: false,msg: "Link expired: Go to Forgot password again."}) 
                }

            }
            else
            {
                return res.status(406).json({authorized: false,msg: "Invalid Link: Token not recognized."}) 
            }
        }
    )
    .catch(
        err=>{
            console.log("ErRoR:"+err)
            return res.status(500).json({authorized: false,msg: "Invalid Link: user not found"})
        }
    )
}

exports.resetPasswordSubmit=(req,res,next)=>{
    const pwdToken=req.body.pwdToken;
    const password=req.body.password;
    const cpassword=req.body.cpassword;
    if(password===cpassword)
    {
        User.findOne({pwdToken: pwdToken})
        .then(storedUser=>{
                if(new Date().getTime()<storedUser.pwdTokenExp.getTime())
                {
                    bcrypt.hash(password,12)
                    .then(hashedPassword=>{
                        storedUser.password=hashedPassword;
                        storedUser.pwdToken=null;
                        storedUser.pwdTokenExp=null;
                        storedUser.save();
                        return res.status(200).json({msg: "New password has been set up."}) 
                    })
                }
                else
                {
                    return res.status(408).json({msg: "Link expired: Go to Forgot password again."}) 
                }
        })
        .catch(err=>{
            console.log(err);
            return res.status(408).json({msg: "Link expired: Go to Forgot password again."});
        })
    }
}