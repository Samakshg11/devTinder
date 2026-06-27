import express, { Request, Response, Router } from "express";
import { userauth } from "../middlewares/auth";
import ConnectionRequest from "../models/connectionRequest";
import User from "../models/user";

const userRouter: Router = express.Router();

const USER_SAFE_DATA = "firstName lastName age photoUrl skills about";

userRouter.get("/user/requests/recieved", userauth, async (req: Request, res: Response): Promise<any> => {
    try {
        const loggedInuser = req.user;
        if (!loggedInuser) {
            return res.status(401).send("Unauthorized");
        }
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInuser._id,
            status: "interested",
        }).populate("fromUserId", "firstName lastName age photoUrl skills about");
        res.json({
            message: "Connection requests recieved",
            data: connectionRequests,
        });
    }
    catch (err: any) {
        res.status(400).send("Error : " + err.message);
    }
});

userRouter.get("/user/connections", userauth, async (req: Request, res: Response): Promise<any> => {
    try {
        const loggedInuser = req.user;
        if (!loggedInuser) {
            return res.status(401).send("Unauthorized");
        }
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInuser._id, status: "accepted" },
                { fromUserId: loggedInuser._id, status: "accepted" },
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);
        
        const data = connectionRequests.map((row: any) => {
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
    catch (err: any) {
        res.status(400).send("Error : " + err.message);
    }
});

userRouter.get("/feed", userauth, async (req: Request, res: Response): Promise<any> => {
    try {
        const loggedInuser = req.user;
        if (!loggedInuser) {
            return res.status(401).send("Unauthorized");
        }
        const page = parseInt(req.query.page as string) || 1;
        let limit = parseInt(req.query.limit as string) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionrequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInuser._id },
                { fromUserId: loggedInuser._id }
            ],
        }).select("fromUserId toUserId");

        const hideUsers = new Set<string>();
        connectionrequests.forEach((reqObj: any) => {
            hideUsers.add(reqObj.fromUserId.toString());
            hideUsers.add(reqObj.toUserId.toString());
        });
        const users = await User.find({
            $and: [
                { _id: { $ne: loggedInuser._id } },
                { _id: { $nin: Array.from(hideUsers) } }
            ]
        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);

        res.send(users);
    }
    catch (err: any) {
        res.status(400).send("Error : " + err.message);
    }
});

export default userRouter;
