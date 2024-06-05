const express = require("express");
const cors = require("cors");
const { connectToDb , getDb} = require('./db-conn');
const authenticationRoutes= require('./auth');

const app = express()
app.use(cors())
app.use(express.json())  

//Routes
app.use('/', authenticationRoutes);

module.exports = app;