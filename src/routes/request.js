const express = require("express");
const requestRouter = express.Router();
const {userauth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const mongoose = require("mongoose");
const { run } = require("../utils/sendEmail");

requestRouter.post("/request/send/:status/:toUserId", userauth, async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).send("Invalid status value.." + status);
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({
                message: "User not found"
            });
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId, toUserId:fromUserId}
            ]
        });
        if(existingConnectionRequest){
            return res.status(400).send("Connection request already exists between these users");
        }


        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        const data = await connectionRequest.save();
        res.json({
            message :req.user.firstName + " has " + status + " " + toUser.firstName,
            data
        })
    }
    catch(err){
        res.status(400).send(err.message);
    }
});


requestRouter.post ("/request/view/:status/:requestId", userauth, async(req,res)=>{
    try{
        const loggedInuser = req.user;
        const{ requestId , status } =req.params;

        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).send("Invalid status value.." + status);
        }
        const connectionRequest = await ConnectionRequest.findById({
            _id:requestId,
            toUserID:loggedInuser._id,
            status:"interested",
        });
        if(!connectionRequest){
            return res
            .status(404)
            .send("Connection request not found");
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message: "Connection request has been " + status,
            data
        })
    }
    catch(err){ 
        res.status(400).send("Error: "+err.message);
    }
});

module.exports = requestRouter;