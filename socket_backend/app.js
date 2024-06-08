const express = require("express");
const cors = require("cors");
const session = require('express-session');
const { connectToDb , getDb} = require('./db-conn');
const authenticationRoutes= require('./auth');
const infoRoutes = require('./info');
const User = require("./schemas/User");
const bcrypt = require('bcrypt');
const MongoStore = require('connect-mongo');



const app = express()
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true // Allow credentials to be sent
}));
app.use(express.json())  

app.use(session({
    
    secret : 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/chat-app',
        collectionName: 'sessions'
      }),
    cookie: {   
        maxAge: 24 * 60 * 60 * 1000,
        secure: false, // set to true if using https
        httpOnly: true, // keep it true to prevent client-side access
        sameSite: 'lax', // or 'strict' or 'none' if secure
        path : '/'
    }
}));




//Routes
app.use('/', authenticationRoutes);
app.use('/', infoRoutes);



module.exports = app;

