const express = require("express");
const connectDB = require("./config/database");
const app =express();
const User= require("./models/user");
const {validateSignupData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { validator } = require("validator");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async(req,res)=>{
try{
    //validation of data
    validateSignupData(req);
    const {firstName,lastName,emailId,password} = req.body;
    //encrypt the password
    const passswordHash = await bcrypt.hash(password,10);
    console.log(passswordHash);


    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passswordHash,
    });
            await user.save();
            res.send("User created successfully");
        }
    catch(err){
        res.status(400).send("Error : "  + err.message);
    }
});

//POST api for login

app.post("/login", async(req,res)=>{
    try{
        const {emailId,password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(isPasswordValid){
            const token = await jwt.sign({_id:user._id},"DEV@Tinder2005");
            res.cookie("token",token);
            res.send("Login successful!!!");
        }
        else{
            throw new Error("Invalid credentials");
        }
    }
    catch(err){
        res.status(400).send("Error : " + err.message);
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

app.get("/profile", async (req,res)=>{
try{
    const cookies = req.cookies;
    const {token} = cookies;
    if(!token){
        throw new Error("Unauthorized");
    }
    const decodedToken = jwt.verify(token,"DEV@Tinder2005");
    const{_id}= decodedToken;
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User not found");
    }
    res.send(user);
}catch(err){
    res.status(400).send("Error fetching user profile");
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

