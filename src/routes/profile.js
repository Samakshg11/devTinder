const express = require("express");
const profileRouter = express.Router();
const {userauth} = require("../middlewares/auth");

profileRouter.get("/profile", userauth,async (req,res)=>{
    try{
        const user=req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("Error fetching user profile");
    }
    });

module.exports = profileRouter;