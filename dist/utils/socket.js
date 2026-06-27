"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const chat_1 = __importDefault(require("../models/chat"));
const initializeSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost", "https://devtinder.site", "http://devtinder.site"],
            credentials: true
        }
    });
    io.on("connection", (socket) => {
        // Handling joining a specific chat room
        socket.on("joinChat", ({ userId, targetUserId }) => {
            const room = [userId, targetUserId].sort().join("_");
            console.log(userId + " joined room: " + room);
            socket.join(room);
        });
        socket.on("sendMessage", async ({ firstName, userId, targetUserId, text }) => {
            try {
                const room = [userId, targetUserId].sort().join("_");
                console.log("Message from " + firstName + " to room " + room + ": " + text);
                // find or create chat
                let chat = await chat_1.default.findOne({
                    participants: { $all: [userId, targetUserId] }
                });
                if (!chat) {
                    chat = new chat_1.default({
                        participants: [userId, targetUserId],
                        messages: []
                    });
                }
                chat.messages.push({
                    senderId: userId,
                    text
                });
                await chat.save();
                io.to(room).emit("messageReceived", { firstName, senderId: userId, text, createdAt: new Date() });
            }
            catch (err) {
                console.error(err);
            }
        });
        socket.on("disconnect", () => { });
    });
};
exports.default = initializeSocket;
