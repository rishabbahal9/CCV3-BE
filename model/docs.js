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
        author: {
            type: Schema.Types.ObjectId,
            ref: User
        },
        dateCreated: {
            type: Date
        },
        dateAuthorized: {
            type: Date
        }
    }
)

module.exports=mongoose.model('Doc',docsSchema)