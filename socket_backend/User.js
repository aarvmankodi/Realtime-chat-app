const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    contacts : [
        {
            type : String,
            unique : true
        }
    ]
    
})

const ChatSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    participants : [String],
    createdAt : {
        type : Date,
        immutable : true,
        default : () => Date.now()
    }
})

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
const User = mongoose.model('User', UserSchema);
module.exports = User;
// model.exports = mongoose.model("Chat" , ChatSchema)
// model.exports = mongoose.model("Message" , MessageSchema)
