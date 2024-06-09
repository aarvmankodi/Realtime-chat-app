const express = require("express");
const http = require("http");
const socketIo = require('socket.io');
const cors = require('cors');
const { connectToDb , getDb} = require('./db-conn');
const app = require("./app")



const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "http://localhost:3000"   
}));


io.on("connection" , (socket) => {

  
  socket.on('registerSocket', async () => {
    const db = getDb();
    const users = db.collection('users');
    await users.updateOne({ _id: socket.userId }, { $set: { socketId: socket.id } });
    socket.emit('registered', socket.userId);
  });


  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});



server.listen(3001, () => console.log("Server started at port 3001"));