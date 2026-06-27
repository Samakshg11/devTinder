"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../utils/validation");
const profileRouter = express_1.default.Router();
profileRouter.get("/profile/view", auth_1.userauth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch (err) {
        res.status(400).send("Error fetching user profile");
    }
});
profileRouter.patch("/profile/edit", auth_1.userauth, async (req, res) => {
    try {
        if (!(0, validation_1.validateEditProfileData)(req)) {
            throw new Error("Invalid edit request");
        }
        const loggedInuser = req.user;
        if (!loggedInuser) {
            return res.status(401).send("Unauthorized");
        }
        console.log("Logged in user:", loggedInuser);
        Object.keys(req.body).forEach((key) => {
            loggedInuser[key] = req.body[key];
        });
        console.log("Logged in user:", loggedInuser);
        await loggedInuser.save();
        res.json({ message: "Profile updated successfully", data: loggedInuser });
    }
    catch (err) {
        console.log("Error updating profile:", err);
        res.status(400).send("Error updating profile");
    }
});
exports.default = profileRouter;
