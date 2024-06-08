const mongoose = require("mongoose")

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
const Chat = mongoose.model("Chat" , ChatSchema)

module.exports = Chat;