
require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");
const app =express();
const User= require("./models/user");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const http = require("http");
const initializeSocket = require("./utils/socket");
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost", "https://devtinder.site"],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB().then(()=>{
    console.log("Database connected successfully");
    server.listen(process.env.PORT,()=>{
        console.log("The server is successfully listening");
    });
})
.catch((err)=>{
    console.error("Database connection failed:", err.message);
});
