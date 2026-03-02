const express = require("express");
const requestRouter = express.Router();
const {userauth} = require("../middlewares/auth");


requestRouter.post("/sendConnectionRequest", userauth, async(req,res)=>{
    const user = req.user;
    console.log("Inside send connection request API");
    res.send(user.firstName + "sendong the connection request");
});

module.exports = requestRouter;