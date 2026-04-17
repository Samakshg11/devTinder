const mongoose = require('mongoose');

const connectDB = async()=>{
       await mongoose.connect(process.env.DB_CONNECTION_SECRET, {
           serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
       })
};
module.exports = connectDB;

