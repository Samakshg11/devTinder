"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const chat_1 = __importDefault(require("../models/chat"));
const chatRouter = express_1.default.Router();
chatRouter.get("/chat/:targetUserId", auth_1.userauth, async (req, res) => {
    const { targetUserId } = req.params;
    if (!req.user) {
        return res.status(401).send("Unauthorized");
    }
    const userId = req.user._id;
    try {
        let chat = await chat_1.default.findOne({
            participants: { $all: [userId, targetUserId] }
        })
            .populate({
            path: "messages.senderId",
            select: "firstName lastName photoUrl"
        })
            .populate({
            path: "participants",
            select: "firstName lastName photoUrl"
        });
        if (!chat) {
            chat = new chat_1.default({
                participants: [userId, targetUserId],
                messages: []
            });
            await chat.save();
            chat = await chat.populate("participants", "firstName lastName photoUrl");
        }
        res.json(chat);
    }
    catch (err) {
        res.status(400).send("Error fetching chat: " + err.message);
    }
});
exports.default = chatRouter;
