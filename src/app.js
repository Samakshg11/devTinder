const express = require("express");
const connectDB = require("./config/database");
const app =express();
const User= require("./models/user");
const {validateSignupData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { validator } = require("validator");
const jwt = require("jsonwebtoken");
const {userauth} = require("./middlewares/auth");


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
            const token = await jwt.sign({_id:user._id},"DEV@Tinder2005",{expiresIn:"1d"});
            res.cookie("token",token,{expiresIn: "1d"});
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

app.get("/profile", userauth,async (req,res)=>{
try{
    const user=req.user;
    res.send(user);
}catch(err){
    res.status(400).send("Error fetching user profile");
}
});

app.post("/sendConnectionRequest", userauth, async(req,res)=>{
    const user = req.user;
    console.log("Inside send connection request API");
    res.send(user.firstName + "sendong the connection request");
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

