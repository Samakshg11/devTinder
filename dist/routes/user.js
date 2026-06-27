"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const connectionRequest_1 = __importDefault(require("../models/connectionRequest"));
const user_1 = __importDefault(require("../models/user"));
const userRouter = express_1.default.Router();
const USER_SAFE_DATA = "firstName lastName age photoUrl skills about";
userRouter.get("/user/requests/recieved", auth_1.userauth, async (req, res) => {
    try {
        const loggedInuser = req.user;
        if (!loggedInuser) {
            return res.status(401).send("Unauthorized");
        }
        const connectionRequests = await connectionRequest_1.default.find({
            toUserId: loggedInuser._id,
            status: "interested",
        }).populate("fromUserId", "firstName lastName age photoUrl skills about");
        res.json({
            message: "Connection requests recieved",
            data: connectionRequests,
        });
    }
    catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});
userRouter.get("/user/connections", auth_1.userauth, async (req, res) => {
    try {
        const loggedInuser = req.user;
        if (!loggedInuser) {
            return res.status(401).send("Unauthorized");
        }
        const connectionRequests = await connectionRequest_1.default.find({
            $or: [
                { toUserId: loggedInuser._id, status: "accepted" },
                { fromUserId: loggedInuser._id, status: "accepted" },
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);
        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInuser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({
            message: "Connections",
            data,
        });
    }
    catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});
userRouter.get("/feed", auth_1.userauth, async (req, res) => {
    try {
        const loggedInuser = req.user;
        if (!loggedInuser) {
            return res.status(401).send("Unauthorized");
        }
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        const connectionrequests = await connectionRequest_1.default.find({
            $or: [
                { toUserId: loggedInuser._id },
                { fromUserId: loggedInuser._id }
            ],
        }).select("fromUserId toUserId");
        const hideUsers = new Set();
        connectionrequests.forEach((reqObj) => {
            hideUsers.add(reqObj.fromUserId.toString());
            hideUsers.add(reqObj.toUserId.toString());
        });
        const users = await user_1.default.find({
            $and: [
                { _id: { $ne: loggedInuser._id } },
                { _id: { $nin: Array.from(hideUsers) } }
            ]
        }).select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);
        res.send(users);
    }
    catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});
exports.default = userRouter;
