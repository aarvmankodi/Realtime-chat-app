const express = require("express");
const cors = require("cors");
const session = require('express-session');
const { connectToDb , getDb} = require('./db-conn');
const authenticationRoutes= require('./auth');
const infoRoutes = require('./info');
const chatRoutes = require('./chatting');




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
app.use('/' , chatRoutes);



module.exports = app;

