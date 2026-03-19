const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {validateSignupData} = require("../utils/validation");


authRouter.post("/signup", async(req,res)=>{
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
               const savedUser= await user.save();
                const token = await user.getJWT();
                 
                res.cookie("token",token,{expiresIn: "1d"});
                res.json({message:"User created successfully",
                    data: savedUser
    });
            }
        catch(err){
            res.status(400).send({error:"Error : "  + err.message});
        }
    });
    
authRouter.post("/login", async(req,res)=>{
        try{
            const {emailId,password} = req.body;
            const user = await User.findOne({emailId: emailId});
            if(!user){
                throw new Error("Invalid credentials");
            }
            const isPasswordValid = await user.comparePassword(password);
            if(isPasswordValid){
    
                const token = await user.getJWT();
                
                res.cookie("token",token,{expiresIn: "1d"});
                res.send(user);
            }
            else{
                throw new Error("Invalid credentials");
            }
        }
        catch(err){
            res.status(400).send("Error : " + err.message);
        }
    });

authRouter.post("/logout", async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    })
    res.send("Logout successful!!!");
});

module.exports = authRouter;