const mongoose = require("mongoose")

const GroupSchema = new mongoose.Schema({
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
const Group = mongoose.model("Group" , GroupSchema)

module.exports = Group;