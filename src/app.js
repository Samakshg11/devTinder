const express = require("express");
const connectDB = require("./config/database");
const app =express();
const User= require("./models/user");
app.use(express.json());
app.post("/signup", async(req,res)=>{
    const user = new User(req.body);
    console.log("User data received:", req.body);
    try{
    await user.save();
    res.send("User created successfully");
    }
    catch(err){
        res.status(400).send("Error creating user"  + err.message);
    }
});

connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(3000,()=>{
        console.log("The server is successfully listening");
    });
})
.catch((err)=>{
    console.log("Database connection failed");
});

