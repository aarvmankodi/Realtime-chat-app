const express = require("express");
const cors = require("cors");
const session = require('express-session');
const { connectToDb , getDb} = require('./db-conn');
const authenticationRoutes= require('./auth');
const infoRoutes = require('./info');
const chatRoutes = require('./chatting');
require("dotenv").config(); 
const MongoStore = require('connect-mongo');
const { v4: uuidv4 } = require('uuid'); 

function generateCookieName() {
    const uniqueId = uuidv4(); // Generate a random UUID
    return `session_${uniqueId}`; // Prefixing with 'session_' for clarity
  }

const app = express()
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true // Allow credentials to be sent
}));
app.use(express.json())  
const cookieName = generateCookieName();


const sessionMiddleWare = session({
    
    secret : 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/chat-app' }),
    cookie: {   
        name: cookieName, 
        maxAge: 24 * 60 * 60 * 1000,
        secure: false, // set to true if using https
        httpOnly: true, // keep it true to prevent client-side access
        sameSite: 'lax', // or 'strict' or 'none' if secure
        path : '/' 
    }
})
app.use(sessionMiddleWare); 


const wrap = (expressMiddleWare) => (socket , next) => expressMiddleWare(socket.request, {}, next );

//Routes
app.use('/', authenticationRoutes);
app.use('/', infoRoutes);
app.use('/' , chatRoutes);



module.exports = {app , sessionMiddleWare , wrap};

