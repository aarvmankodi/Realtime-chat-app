const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');

const info = express.Router();


info.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true // Allow credentials to be sent
}));
info.use(express.json());

info.get('/user/contacts', (req, res) => {
    if (req.session.user){
        // console.log(req.session)
        res.status(200).json({ contacts: req.session.user.contacts });
    } else {
        // console.log(req.session)
        console.log("user dont exist");
        res.status(201).json({ error: 'Not authenticated' });
    }
});

info.post('/user/contacts/add', async (req,res) => {
    // console.log(req.session);
    try
        {
        const useremail = req.session.user.email;
            

        const User = require("./User");
        const user = await User.findOne({email : useremail});

        if (user){
            user.contacts.push(req.body.newData);
            req.session.user.contacts.push(req.body.newData);
        await user.save(); 
        req.session.save();
        console.log(req.session.user);
        res.status(201).json({ message: req.body.newData , also : 'Data added successfully' });
        }
    } catch (e){
        console.error('Error adding data:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
})


module.exports = info;
