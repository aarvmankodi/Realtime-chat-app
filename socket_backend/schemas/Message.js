const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({
    chatName : {
        type : String,
        required : true
    },
    sender : {
        type : String,
        required : true
    },
    message : String,
    createdAt : {
        type : Date,
        immutable : true,
        default : () => Date.now()
    }
})

const Message = mongoose.model("Message" , MessageSchema)

module.exports = Message;