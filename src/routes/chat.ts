import express, { Request, Response, Router } from "express";
import { userauth } from "../middlewares/auth";
import Chat from "../models/chat";

const chatRouter: Router = express.Router();

chatRouter.get("/chat/:targetUserId", userauth, async (req: Request, res: Response): Promise<any> => {
    const { targetUserId } = req.params;
    if (!req.user) {
        return res.status(401).send("Unauthorized");
    }
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
    } catch (err: any) {
        res.status(400).send("Error fetching chat: " + err.message);
    }
});

export default chatRouter;
