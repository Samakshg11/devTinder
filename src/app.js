const express = require("express");
// const { adminauth ,userauth} = require("./middlewares/auth");

const app =express();

// app.use("/admin",adminauth);
// app.use("/user",userauth);


app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("Internal Server Error");
    }
});
app.get("/user/getuserdata",(req,res) => {
    // try{
    throw new Error("This is an error in getuserdata route");
    res.send("This is the user data");
// }
// catch(err){
//     res.status(500).send("external Server Error");
// }
});
// app.get("/admin/getdata",(req,res)=>{
//     res.send("This is the admin data");
// });

// app.post("/user/login",(req,res)=>{
//     res.send("The user has logged in");
// });
app.use("/user",(err,req,res,next)=>{
    if(err){
        res.status(500).send("external  Server Error");
    }
});
app.listen(3000,()=>{
    console.log("The server is successfully listening")
;});