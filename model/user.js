const mongoose=require('mongoose')
const Schema=mongoose.Schema

const userSchema=new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        imgUrl: {
            type: String,
            required: true
        },
        emailVerified: {
            type: Boolean,
            required: true
        },
        dateCreated:{
            type: Date,
            required: true
        },
        admin:{
            type: Boolean,
            required: true
        },
        starred: {
            type: Array
        },
        uploaded: {
            type: Array
        },
        pwdToken: {
            type: String
        },
        pwdTokenExp: {
            type: Date
        },
        bio:{
            type:String           
        }
    }
)

module.exports=mongoose.model('User',userSchema)