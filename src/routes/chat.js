const express = require("express");
const { userauth } = require("../middlewares/auth");
const Chat = require("../models/chat");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userauth, async (req, res) => {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    try {
        let chat = await Chat.findOne({
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
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            });
            await chat.save();
            chat = await chat.populate("participants", "firstName lastName photoUrl");
        }

        res.json(chat);
    } catch (err) {
        res.status(400).send("Error fetching chat: " + err.message);
    }
});

module.exports = chatRouter;
