const express = require("express");
const {userauth} = require("../middlewares/auth");
const mongoose = require("mongoose");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName age photoUrl skills about";

userRouter.get("/user/requests/recieved",userauth, async(req,res)=>{
    try{
        const loggedInuser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId:loggedInuser._id,
            status:"interested",
        }).populate("fromUserId","firstName lastName age photoUrl");
        res.json({
            message:"Connection requests recieved",
            data:connectionRequests,
        })
    }
    catch(err){
        res.status(400).send("Error : "+err.message);
    }
});

userRouter.get("/user/connections",userauth, async(req,res)=>{
    try{
        const loggedInuser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInuser._id, status:"accepted"},
                {fromUserId:loggedInuser._id, status:"accepted"},
            ]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);
        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() ===loggedInuser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId});
        
        res.json({
            message:"Connections",
            data,
        })
    }
    catch(err){
        res.status(400).send("Error : "+err.message);
    }
});

userRouter.get("/feed",userauth ,async(req,res)=>{
    try{
        const loggedInuser = req.user;
        const page = parseInt(req.query.page) ||1;
        let limit = parseInt(req.query.limit) ||10;
        limit = limit>50?50:limit;
        const skip = (page-1)*limit;

        const connectionrequests = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInuser._id},
                {fromUserId:loggedInuser._id}
            ],
        }).select("fromUserId toUserId");

        const hideUsers = new Set();
        connectionrequests.forEach(req=>{
            hideUsers.add(req.fromUserId.toString());
            hideUsers.add(req.toUserId.toString());
        })
        const users = await User.find({
            $and:[
                {_id:{$ne:loggedInuser._id}},
                {_id:{$nin:Array.from(hideUsers)}}
            ]
        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);

        res.send(users);
    }
    catch(err){
        res.status(400).send("Error : "+err.message);
    }
})

module.exports = userRouter;