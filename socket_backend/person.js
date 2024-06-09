const mongoose = require("mongoose")

const PersonSchema = new mongoose.Schema({
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
        }
    ]
    
}, {collection : 'users'})



const Person = mongoose.model('Person', PersonSchema);

module.exports = Person;
