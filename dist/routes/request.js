"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const connectionRequest_1 = __importDefault(require("../models/connectionRequest"));
const user_1 = __importDefault(require("../models/user"));
const sendEmail = __importStar(require("../utils/sendEmail"));
const requestRouter = express_1.default.Router();
requestRouter.post("/request/send/:status/:toUserId", auth_1.userauth, async (req, res) => {
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
        const toUser = await user_1.default.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const existingConnectionRequest = await connectionRequest_1.default.findOne({
            fromUserId,
            toUserId
        });
        let data;
        if (existingConnectionRequest) {
            existingConnectionRequest.status = status;
            data = await existingConnectionRequest.save();
        }
        else {
            const connectionRequest = new connectionRequest_1.default({
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
        }
        catch (err) {
            console.log("Email error:", err.message);
        }
        res.json({
            message: req.user.firstName + " has " + status + " " + toUser.firstName,
            data
        });
    }
    catch (err) {
        console.log("ERROR:", err);
        res.status(400).send(err.message);
    }
});
requestRouter.post("/request/view/:status/:requestId", auth_1.userauth, async (req, res) => {
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
        const connectionRequest = await connectionRequest_1.default.findOne({
            _id: requestId,
            toUserId: loggedInuser._id,
            status: "interested",
        });
        if (!connectionRequest) {
            return res
                .status(404)
                .send("Connection request not found");
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message: "Connection request has been " + status,
            data
        });
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});
exports.default = requestRouter;
