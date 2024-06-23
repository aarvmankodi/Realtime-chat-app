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

info.get('/getInfo', async (req, res) => {
    const user = req.query.user.chatter;

    const info = await User.findOne({name : user});
    if (info) {
        res.status(200).json({email : info.email});
    }
      
    
  })

info.post('/addUserToGrp', async (req,res) => {
        
    try {
        if (req.session.user){    
            const user = req.body.user;
            const talkingTo = req.body.talkingTo;
            console.log(user);
            console.log(talkingTo);
            if (talkingTo.type != 'group'){
                res.status(404).json({err : "not a group"});
            } else {
                const userInDb = await User.findOne({name : user});
                const grpName = await Group.findOne({name : talkingTo.chatter});
                if (!userInDb || !grpName){
                    res.status(210).json({message : "User or Group not found"});
                }
                else {
                    const userinGrp = await Group.findOne({
                        name : talkingTo.chatter , 
                        participants: { $elemMatch: { $eq: user }}
                    })
                    if (userinGrp){
                        res.status(218).json({message : "User already added"});
                    } else {
                        userInDb.groups.push(talkingTo.chatter);
                        await userInDb.save();
                        grpName.participants.push(user);
                        await grpName.save();
                        res.status(200).json({message : "User added" , members : grpName.participants});
                    }
                
                }
                
            }}
       
    } catch(e){
        console.log("the error when adding user to group is " , e);
        res.status(400).json({err : "an error occured in server"}); 
    }

})

info.post('/removeUser' , async (req,res) => {
    const user = req.body.user;
    const talkingTo = req.body.talkingTo;

    try{
        if (talkingTo.type == 'contact'){
            
            const db = await User.findOne({name : user});
            if (db){
                console.log('ggggggg' , db);
                await User.updateOne(
                    {name : user},
                    {$pull : {contacts : talkingTo.chatter}}
                );
                const updatedUser = await User.findOne({ name: user });
                console.log('Updated User:', updatedUser);

                res.status(200).json({message : "User removed"});
            }
        } else if (talkingTo.type == 'group'){
            const db = await User.findOne({name : user});
            if (db){
                console.log('ggggggg' , db);
                await User.updateOne(
                    {name : user},
                    {$pull : {groups : talkingTo.chatter}}
                );
                const updatedGroup = await User.findOne({ name: user });
                console.log('Updated Group:', updatedGroup);

                res.status(200).json({message : "Group removed"});
            }
        }
    }catch(e){
        console.log(e);
    }
})

info.get('/grpMem' , async (req,res) => {
    const grpName = req.query.chatter;
    try {
        const grp = await Group.findOne({name : grpName});
        if (grp){
            res.status(200).json({members : grp.participants});
        }
    }catch(e){
        console.log(e)
    }
})

info.get('/getMembers' , async (req,res) => {
    const sentName = req.query.chattingTo;

    const userFound = await User.findOne({name : sentName});

    if (userFound != null){
        const userEmail = userFound.email;
        res.status(200).json({
            message : "User was found. Here are the details",
            name : sentName,
            email : userEmail
        });
    } else {
        res.status(400).json({
            message : "User not found in db"
        });
    }
})
module.exports = info;