const express = require("express");
const connectDB = require("./config/database");
const app =express();
const User= require("./models/user");
app.use(express.json());

app.post("/signup", async(req,res)=>{
    const user = new User(req.body);
    console.log("User data received:", req.body);
    try{
        const existingUser = await User.findOne({ emailId: user.emailId });
        if(existingUser){
            res.status(400).send("User with this email already exists");
        }
        else{
            await user.save();
            res.send("User created successfully");
        }
    }
    catch(err){
        res.status(400).send("Error creating user"  + err.message);
    }
});
//GET user by email

app.get("/user", async (req,res)=>{
    const userEmail = req.body.emailId;
try{
    const users = await User.findOne ({emailId: userEmail});
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
app.delete("/user", async(req,res) =>{
    const userId = req.body.userId;
    try{
    const users = await User.findByIdAndDelete(userId);
    if(!users){
        res.status(404).send("User not found");
    }
    else{
        res.send("User deleted successfully");
    }
    }catch(err){
        res.status(400).send("Error deleting user");
    }
})
app.patch("/user/:userId", async(req,res)=>{
    const userId = req.params?.userId;
    const updateData = req.body;
    try{
        const ALLOWED_UPDATES =[
            "photoUrl",
            "about",
            "gender",
            "skills"
        ];
            const isValidUpdate = Object.keys(updateData).every((update) => ALLOWED_UPDATES.includes(update));
            if(!isValidUpdate){
                throw new Error("Invalid user update");
            }
            if(updateData.skills.length > 5){
                throw new Error("Skills cannot be more than 5");
            }
        const user = await User.findByIdAndUpdate({_id:userId},updateData,{
            returnDocument:"after",runValidators:true});
            console.log(user);
        res.send("User updated successfully");
    }
    
    catch(err){
        res.status(400).send("Error updating user"+ err.message);
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

