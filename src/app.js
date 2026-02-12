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
//GET user by email

app.get("/user", async (req,res)=>{
    const userEmail = req.body.emailId;
try{
    const users = await User.findOne({emailId: userEmail});
    if(users.length === 0){
        res.status(404).send("User not found");
    }
    else{
        res.send(users);
    }
}
catch(err){
    res.status(400).send("Error fetching user");
}
});

//GET users by feed API by getting all the users from the database
app.get("/feed", async (req,res)=>{
    try{
    const users = await User.find({});
    res.send(users);
    }catch(err){
        res.status(400).send("Error fetching user");
    };
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

