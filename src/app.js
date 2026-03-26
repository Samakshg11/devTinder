const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

console.log("ENV FILE PATH:", path.resolve(__dirname, "../.env"));
console.log("ENV VALUE:", process.env.AWS_ACCESS_KEY_ID);
console.log("ENV VALUE:", process.env.AWS_SECRET_ACCESS_KEY);

const express = require("express");
const connectDB = require("./config/database");
const app =express();
const User= require("./models/user");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");
const cookieParser = require("cookie-parser");
console.log("ENV PATH CHECK");
console.log("ACCESS KEY:", process.env.AWS_ACCESS_KEY_ID);
console.log("SECRET KEY:", process.env.AWS_SECRET_ACCESS_KEY);

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
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
