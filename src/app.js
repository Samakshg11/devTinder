const express = require("express");
const app =express();
// app.use("/",(req,res)=>{
//     res.send("Nothing happened");
// });
// app.get("/user",(req,res)=>{
//     res.send("User getting data");
// })

app.get("/user/:userId/:name/:password",(req,res)=>{
    console.log(req.params);
    // console.log(req.query);
// app.get(/.*fly$/,(req,res)=>{
// app.get("/ab\\?c", (req,res)=>{
    res.send({firstname:"Samaksh", lastname:"Garg"});
});


app.listen(3000,()=>{
    console.log("The server is successfully listening")
;});