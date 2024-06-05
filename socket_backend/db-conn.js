const mongoose = require('mongoose');

const connectToDb = (callback) => {
    mongoose.connect('mongodb://localhost:27017/chat-app', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Database connected successfully');
        callback();
    })
    .catch((err) => {
        console.error('Error connecting to database:', err);
        callback(err);
    });
};

module.exports = { connectToDb };
