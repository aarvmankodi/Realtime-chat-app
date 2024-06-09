const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const User = require("./person");
const Message = require("./schemas/Message");


const info = express.Router();

info.use(cors({
    origin: 'http://localhost:3000',
    credentials: true 
}));
info.use(express.json());

info.get('/user/contacts', async (req, res) => {
    if (req.session.user){
        const RealUser = await User.findOne({email : req.session.user.email});
        console.log(RealUser.contacts);
        console.log("req time");
        req.session.user.contacts = RealUser.contacts;
        console.log("this is totally the one"); 
        console.log(req.session.user.contacts);       
        res.status(200).json({ contacts: req.session.user.contacts });
    } else {
        
        console.log("user dont exist");
        res.status(201).json({ error: 'Not authenticated' });
    }
});

info.post('/user/contacts/add', async (req,res) => {
    ;
    try
        {
        const newUserEmail = req.body.newData;
        const userEmail = req.session.user.email;
            

        const user = await User.findOne({email : userEmail});
        const newUser = await User.findOne({email : newUserEmail});
        
        if (user){
            if (newUser ){
                if (user.contacts.includes(newUser.name) || user.email === newUser.email){
                    return res.status(203).json({message : 'User is already in contacts'});
                } else {
                    user.contacts.push(newUser.name);
                    req.session.user.contacts.push(newUser.name);
                    await user.save(); 
                    req.session.save();
                    console.log(req.session.user);
                    res.status(201).json({ message:'Data added successfully' });
                }
            } else {
                res.status(202).json({message : 'The user you are trying to add does not exist'});
            }
        }
    } catch (e){
        console.error('Error adding data:', e);
        res.status(500).json({ error: 'Something went wrong' });
    } 
})

info.get('/getCurrentUser', (req, res) => {
    if (req.session && req.session.user) {
      res.json({ username: req.session.user.name });
    } else {
      res.status(401).send('User not authenticated');
    }
  });
module.exports = info;
