const express = require("express");
const cors = require("cors");
const session = require('express-session');
const { connectToDb , getDb} = require('./db-conn');
const authenticationRoutes= require('./auth');
const infoRoutes = require('./info');

const app = express()
app.use(cors())
app.use(express.json())  

app.use(session({
    secret : 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

//Routes
app.use('/', authenticationRoutes);
app.use('/', infoRoutes);

module.exports = app;

