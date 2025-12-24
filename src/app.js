const express = require("express");
const app =express();
app.use("/test",(req,res)=>{
    res.send("namaste from server");
});
app.use("/hello",(req,res)=>{
    res.send("hello hello hello");
});
app.listen(3000,()=>{
    console.log("The server is successfully listening")
;});