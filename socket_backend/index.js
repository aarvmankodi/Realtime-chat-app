const express = require("express");
const http = require("http");
const socketIo = require('socket.io');
const cors = require('cors');
const { connectToDb , getDb} = require('./db-conn');
const {app , sessionMiddleWare, wrap} = require("./app");
require("dotenv").config();
const { promisify } = require('util');



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

io.on("connection", (socket) => {
  console.log('New connection, session ID:', socket.request.sessionID);

  socket.on('registerSocket', async () => {
    const db = getDb();
    const users = db.collection('users');
    await users.updateOne({ _id: socket.userId }, { $set: { socketId: socket.id } });
    socket.emit('registered', socket.userId);
  });

  socket.on('join room', ({ currentUser, selectedChat }) => {
    const room = `${currentUser}-${selectedChat}`;
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on('chat message', async (msg) => {
    try {
      const reloadSession = promisify(socket.request.session.reload).bind(socket.request.session);
      await reloadSession();
      
      if (socket.request.session.user) {
        const chatRoom = `${socket.request.session.user.name}-${msg.chatTo}`;
        console.log("Session ID:", socket.request.sessionID);
        console.log("Session data:", socket.request.session.user);
        console.log("Emitting message to room:", chatRoom);
        io.to(chatRoom).emit('chat message', msg); // Emit to the specific room
      } else {
        console.log("No user session found");
      }
    } catch (err) {
      console.error('Failed to reload session:', err);
    }
  });

  socket.on('clear chat', async () => {
    try {
      const reloadSession = promisify(socket.request.session.reload).bind(socket.request.session);
      await reloadSession();

      if (socket.request.session.user) {
        const chatRoom = `${socket.request.session.user.name}-${socket.request.session.user.chattingTo}`;
        console.log("Clearing chat for room:", chatRoom);
        io.to(chatRoom).emit('clear chat'); // Emit clear chat to the specific room
      } else {
        console.log("No user session found");
      }
    } catch (err) {
      console.error('Failed to reload session:', err);
    }
  });
});





server.listen(3001, () => console.log("Server started at port 3001"));