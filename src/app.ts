import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/database";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import requestRouter from "./routes/request";
import userRouter from "./routes/user";
import chatRouter from "./routes/chat";
import http from "http";
import initializeSocket from "./utils/socket";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost", "https://devtinder.site", "http://devtinder.site"],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);
app.use("/api", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB().then(() => {
    console.log("Database connected successfully");
    server.listen(process.env.PORT, () => {
        console.log("The server is successfully listening");
    });
})
.catch((err: any) => {
    console.error("Database connection failed:", err.message);
});
