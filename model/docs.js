const mongoose=require('mongoose')
const User=require('./user')
const Schema=mongoose.Schema

const docsSchema=new Schema(
    {
        heading: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        authorized: {
            type: Boolean,
            required: true
        },
        userFirstName: {
            type: String,
            required: true
        },
        userEmail: {
            type: String,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: User,
            required: true
        },
        dateCreated: {
            type: Date,
            required: true
        },
        filename: {
            type: String,
            required: true
        },
        originalname: {
            type: String,
            required: true
        },
        rejected: {
            type: Boolean,
            required: true
        },
        dateAuthorized: {
            type: Date
        },
        views: {
            type: Number
        },
        comments: {
            type: Array
        }
    }
)

module.exports=mongoose.model('Doc',docsSchema)