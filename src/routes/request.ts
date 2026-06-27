import express, { Request, Response, Router } from "express";
import { userauth } from "../middlewares/auth";
import ConnectionRequest from "../models/connectionRequest";
import User from "../models/user";
import * as sendEmail from "../utils/sendEmail";

const requestRouter: Router = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userauth, async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("Invalid status value.." + status);
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            fromUserId,
            toUserId
        });

        let data;

        if (existingConnectionRequest) {
            existingConnectionRequest.status = status as any;
            data = await existingConnectionRequest.save();
        } else {
            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status,
            });
            data = await connectionRequest.save();
        }

        // ✅ EMAIL (ab har case me chalega)
        try {
            const emailRes = await sendEmail.run();
            console.log("Email response:", emailRes);
        } catch (err: any) {
            console.log("Email error:", err.message);
        }

        res.json({
            message: req.user.firstName + " has " + status + " " + toUser.firstName,
            data
        });

    } catch (err: any) {
        console.log("ERROR:", err);
        res.status(400).send(err.message);
    }
});

requestRouter.post("/request/view/:status/:requestId", userauth, async (req: Request, res: Response): Promise<any> => {
    try {
        const loggedInuser = req.user;
        if (!loggedInuser) {
            return res.status(401).send("Unauthorized");
        }
        const { requestId, status } = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("Invalid status value.." + status);
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInuser._id,
            status: "interested",
        });
        if (!connectionRequest) {
            return res
                .status(404)
                .send("Connection request not found");
        }
        connectionRequest.status = status as any;
        const data = await connectionRequest.save();
        res.json({
            message: "Connection request has been " + status,
            data
        });
    }
    catch (err: any) { 
        res.status(400).send("Error: " + err.message);
    }
});

export default requestRouter;
