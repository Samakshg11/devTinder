const express = require("express");
const {userauth} = require("../middlewares/auth");
const mongoose = require("mongoose");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/user/requests/recieved",userauth, async(req,res)=>{
    try{
        const loggedInuser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId:loggedInuser._id,
            status:"interested",
        })
        res.json({
            message:"Connection requests recieved",
            data:connectionRequests,
        })
    }
    catch(err){
        res.status(400).send("Error : "+err.message);
    }
})

module.exports = userRouter;