const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const User = require("./schemas/User");
const Message = require("./schemas/Message");
const Group = require("./schemas/Group");


const info = express.Router();

info.use(cors({
    origin: 'http://localhost:3000',
    credentials: true 
}));
info.use(express.json());

info.get('/user/contacts', async (req, res) => {
    if (req.session.user){
        const RealUser = await User.findOne({email : req.session.user.email});
        req.session.user.contacts = RealUser.contacts;
        req.session.user.groups = RealUser.groups;
        res.status(200).json({ contacts: req.session.user.contacts , groups : req.session.user.groups});
    } else {
        
        console.log("user dont exist"); 
        res.status(201).json({ error: 'Not authenticated' }); 
    }
});

info.post('/user/contacts/add', async (req,res) => {
    ;
    try
        {
        const newUserName = req.body.newData.toLowerCase();
        const userName = req.session.user.name;
            

        const user = await User.findOne({name : userName});
        const newUser = await User.findOne({name : newUserName});
        
        if (user){
            if (newUser){
                if (user.contacts.includes(newUser.name) || user.name === newUser.name){
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

info.post('/user/createGrp' , async (req,res) => {
    const grpName = req.body.grpName;
    const members = req.body.members;
    const userName = req.session.user.name;

    const user = await User.findOne({name : 
    userName});
    try{
        if (grpName && user){
            if (!Array.isArray(members)){
                members = members.split(' ');
            }
            members.push(userName);
            const newGrp = new Group({
                name : grpName,
                participants : members,
                
            })
            await newGrp.save();
            user.groups.push(grpName);
            await user.save();
            res.status(200).json({msg : "group created"});
        } else {
            
            res.status(208).json({msg : "incorrect creds"});
        }
    }catch(e){
        res.status(218).json({msg : "an error occured"});
        console.log(e);
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
