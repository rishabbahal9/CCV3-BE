const bcrypt=require('bcryptjs')
const User=require('./../model/user')

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
            dateCreated:dateCreated
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
                        res.status(201).json({msg: 'Details successfully stored! A link has been sent to your email, click the link to verify your email. (Mail might be stored in spam section)'})
                        console.log("Result")
                        console.log(result._id)
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
        console.log(user)
        if(!user)
            res.status(401).json({msg: "Email not found", authenticated: false, user: {}})
        else
        {
            bcrypt.compare(password,user.password)
            .then(
                doMatch=>{
                    if(!doMatch)
                    {
                        res.status(401).json({msg: "Incorrect password", authenticated: false, user: {}})
                    }
                    else
                    {
                        if(user.emailVerified)
                            res.status(200).json({msg: "Successfully logged in!", authenticated: true, user: user})
                        else
                            res.status(401).json({msg: "Your email is yet not verified!", authenticated: false, user: {}})
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