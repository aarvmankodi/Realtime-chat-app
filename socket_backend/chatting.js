const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const Message = require("./schemas/Message");


const chatting = express.Router();

chatting.use(cors({
    origin: 'http://localhost:3000',
    credentials: true 
}));
chatting.use(express.json());


chatting.post('/chatsTo' , (req,res) => {
    const chatsTo = req.body.chatter;
    req.session.user.chattingTo = chatsTo;
    req.session.save((err) => {
        if (err) {
          console.error('Failed to save session:', err);
          return res.status(500).json({ message: 'Failed to change chatter' });
        }
        console.log('Session after save:', req.session.user.chattingTo);
        res.status(200).json({ message: 'Chatter changed' });
      });
})

chatting.post('/sendMsg', async (req,res) => {
    if (req.session.user.chattingTo){
        const chatsTo = req.session.user.chattingTo;
        const messageSent = req.body.sentMsg; 
        try{
            const newMessage = new Message({
                chatName : chatsTo,
                sender : req.session.user.name,
                message : messageSent
            });
    
            await newMessage.save();
            console.log("ttttttttttttt" , newMessage);
            res.status(200).json({report : 'message sent', chatTo : chatsTo , message : newMessage}); 
        } catch(e){
            res.status(400).json({err : 'message not sent'});
        }
    } else {
        res.status(202).json({mnessage : 'no user selected'})
    }

})

chatting.get('/getMsg' , async (req,res) => { 
    if (req.session.user.chattingTo != 'default'){
        const chatsTo = req.session.user.chattingTo;
        const user = req.session.user.name;
        const param = req.query.chatName;
        if (param === chatsTo){
            const chats = await Message.find({
                $or: [
                   { $and : [{chatName : user}, {sender : chatsTo}]},  
                   { $and : [{chatName : chatsTo}, {sender : user}]}
                ]
              })
                console.log("///////" , chats);
            chats.sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                // console.log((b.createdAt) , b.message);
                // console.log((a.createdAt) , a.message);
                return (a.createdAt) - (b.createdAt);
              });
              console.log("???????" , chats)
            // const messages = chats.map(chat => chat.message); 
            // console.log(messages);
            res.status(200).json({messagesSent : chats , chatTo : chatsTo});
              
              
            
        }
        // const chats = await Message.find({chatName : chatsTo});
        
    }
})

module.exports = chatting;