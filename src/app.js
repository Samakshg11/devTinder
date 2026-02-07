const express = require("express");
const { adminauth ,userauth} = require("./middlewares/auth");
const app =express();
app.use("/admin",adminauth);
app.use("/user",userauth);
// app.use("/",(req,res)=>{
//     res.send("Nothing happened");
// });
// app.get("/user",(req,res)=>{
//     res.send("User getting data");
// })

// app.get("/user/:userId/:name/:password",(req,res)=>{
//     console.log(req.params);
//     // console.log(req.query);
// // app.get(/.*fly$/,(req,res)=>{
// // app.get("/ab\\?c", (req,res)=>{
//     res.send({firstname:"Samaksh", lastname:"Garg"});
// });

//  app.use(
//     "/user",
//     (req,res,next)=>{
//         console.log("This is the first function");
//         next();
//     },
//     (req,res,next)=>{
//         console.log("This is the second function");
//         next();
//     },
//  )


// app.get("/",(req,res,next)=>{
//     console.log("handling response");
//     next();
// },
// (req,res,next)=>{
//     console.log("This is the next function");
//     next();    
// },
// (req,res,next)=>{
//     console.log("This is the next function");
//     res.send("This is the third function");
// });


app.get("/admin/getdata",(req,res)=>{
    res.send("This is the admin data");
});

app.post("/user/login",(req,res)=>{
    res.send("The user has logged in");
});
app.listen(3000,()=>{
    console.log("The server is successfully listening")
;});