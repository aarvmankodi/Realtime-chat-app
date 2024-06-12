const express = require("express");
const http = require("http");
const socketIo = require('socket.io');
const cors = require('cors');
const { connectToDb , getDb} = require('./db-conn');
const {app , sessionMiddleWare, wrap} = require("./app");
require("dotenv").config();


const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true 
  }
});


app.use(cors({
  origin: "http://localhost:3000"   
}));

io.use(wrap(sessionMiddleWare));

io.on("connection" , (socket) => {

  
  socket.on('registerSocket', async () => {
    const db = getDb();
    const users = db.collection('users');
    await users.updateOne({ _id: socket.userId }, { $set: { socketId: socket.id } });
    socket.emit('registered', socket.userId);
  });


  socket.on('chat message',(msg) => {
    {
      console.log("this is the session tho" , socket.request.session.user)
      console.log("msging up in here" , msg);
      io.emit('chat message', msg);
    }
    
  });

  socket.on('clear chat', () => {
    console.log("Clearing chat");

    // This will broadcast the clear chat event to all connected clients
    io.emit('clear chat');
  });
});





server.listen(3001, () => console.log("Server started at port 3001"));