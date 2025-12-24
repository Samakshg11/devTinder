const express = require("express");
const app =express();
// app.use("/",(req,res)=>{
//     res.send("Nothing happened");
// });
// app.get("/user",(req,res)=>{
//     res.send("User getting data");
// })
app.get("/user",(req,res)=>{
    res.send({firstname:"Samaksh", lastname:"Garg"})
})
app.post("/user",(req,res)=>{
    res.send("Posted successfully");
});
app.patch("/user",(req,res)=>{
    res.send("Patch is created");
})
app.delete("/user",(req,res)=>{
    res.send("Delete done");
})
app.use("/test",(req,res)=>{
    res.send("namaste from server");
});
app.use("/hello",(req,res)=>{
    res.send("hello hello hello");
});
// app.use("/hello",(req,res)=>{
//     res.send("hello hello hello");
// });
app.use("/",(req,res)=>{
    res.send("Nothing happened");
});
app.listen(3000,()=>{
    console.log("The server is successfully listening")
;});