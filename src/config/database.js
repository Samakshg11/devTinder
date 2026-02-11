const mongoose = require('mongoose');

const connectDB = async()=>{
    mongoose.connect(
        "mongodb+srv://samakshgarg2005:sam1234@samaksh.lvn4oqw.mongodb.net/devTinder"
    );
};
module.exports = connectDB;

