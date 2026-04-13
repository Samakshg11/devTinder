const express = require("express");
const profileRouter = express.Router();
const {userauth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");

profileRouter.get("/profile/view", userauth,async (req,res)=>{
    try{
        const user=req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("Error fetching user profile");
    }
    });
profileRouter.patch("/profile/edit",userauth,async(req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid edit request");
        }
        const loggedInuser = req.user;
        console.log("Logged in user:", loggedInuser);
        Object.keys(req.body).forEach((key)=>{
            loggedInuser[key] = req.body[key];
        });
        console.log("Logged in user:", loggedInuser);

        await loggedInuser.save();
        res.json({ message: "Profile updated successfully", data: loggedInuser });
    }catch(err){
        console.log("Error updating profile:", err);
        res.status(400).send("Error updating profile");
    }
});
module.exports = profileRouter;