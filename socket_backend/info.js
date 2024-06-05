// const express = require('express');
// const mongoose = require("mongoose");
// const cors = require('cors');



// const info = express.Router();


// const corsOptions = {
//     origin: 'http://localhost:3000',
//     credentials: true // Allow credentials (cookies, authorization headers)
// };


// info.use(cors());
// info.use(express.json());

// info.get('/user/contacts', (req, res) => {
//     if (req.session.user) {
//         res.status(200).json({ user: req.session.user.contacts });
//     } else {
//         res.status(401).json({ error: 'Not authenticated' });
//     }
// });

// module.exports = info;

const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');

const info = express.Router();

// Allow requests from 'http://localhost:3000'
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true // Allow credentials (cookies, authorization headers)
};

info.use(cors(corsOptions));
info.use(express.json());

info.get('/user/contacts', (req, res) => {
    if (req.session.user) {
        console.log(req.session.user)
        res.status(200).json({ contacts: req.session.user.contacts });
    } else {
        res.status(201).json({ error: 'Not authenticated' });
    }
});



info.post('/user/contacts/add', async (req,res) => {
    console.log(req.session);
    try
        {const useremail = req.session.user.email;
            

        const User = require("./User");
        const user = await User.findOne({email : useremail});

        if (user){
            user.contacts.push(req.body.newData);
        await user.save(); 
        req.session.user.contacts.push(req.body.newData);
        res.status(201).json({ message: req.body.newData , also : 'Data added successfully' });
        }
    } catch (e){
        console.error('Error adding data:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = info;
