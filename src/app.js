const express = require("express");
const connectDB = require("./config/database");
const app =express();
const User= require("./models/user");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(3000,()=>{
        console.log("The server is successfully listening");
    });
})
.catch((err)=>{
    console.log("Database connection failed");
});
