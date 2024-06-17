const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { connectToDb } = require('./db-conn');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const User = require("./schemas/User");

const router = express.Router();
router.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true // Allow credentials to be sent
}));
router.use(express.json());

// Generate a unique random ID function
const generateUniqueId = () => {
    return Math.random().toString(36).substring(2);
};


//database connection
let db;
connectToDb((err) => {
    if (!err) {
        console.log("Database connected successfully");
    } else {
        console.error("Error connecting to database:", err);
    }
});

//Sign Up route
router.post('/signup', async (req, res) => {
    let { form, name, email, password } = req.body;
    name = name.toLowerCase();
    if (form === 'users') {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
        

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            console.error('Error during user registration:', err);
            res.status(500).json({ error: 'Could not create user' });
        }
        
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { form, email, password } = req.body;
        try {
            if ( form === 'users'){
                const user = await User.findOne({ email })    
            if (user) {
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (isPasswordValid){
                   
                    const uniqueId = generateUniqueId();
                    req.session.user = {
                        id : uniqueId,
                        name : user.name,
                        email : user.email,
                        contacts : user.contacts,
                        chattingTo : 'default'
                    }
                    
                    res.status(200).json({ message: 'Login successful' });
                    // console.log(req.session.user);
                }else
                res.status(201).json({ error: 'Invalid credentials' });
            } else {
                res.status(404).json({ error: 'User Not Found' });
            }
            }
            
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    
});

router.get('/logout', async (req, res) => {
    if (req.session.user) {
        // Destroy session from memory and store
        req.session.destroy((err) => {
            if (err) {
                 res.status(500).send('Failed to destroy session');
            }
            res.clearCookie('connect.sid'); // Default cookie name for session ID
             res.status(200).json({message : "logged out"});
        });
    } else {
        res.status(208).json({message : "session not created"});
    }
});



module.exports = router;