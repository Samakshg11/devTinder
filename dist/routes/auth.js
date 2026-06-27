"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const validation_1 = require("../utils/validation");
const authRouter = express_1.default.Router();
authRouter.post("/signup", async (req, res) => {
    try {
        //validation of data
        (0, validation_1.validateSignupData)(req);
        const { firstName, lastName, emailId, password } = req.body;
        //encrypt the password
        const passswordHash = await bcrypt_1.default.hash(password, 10);
        const user = new user_1.default({
            firstName,
            lastName,
            emailId,
            password: passswordHash,
        });
        const savedUser = await user.save();
        const token = await user.getJWT();
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3 * 60 * 60 * 1000,
            sameSite: "lax",
            path: "/"
        });
        res.json({
            message: "User created successfully",
            data: savedUser
        });
    }
    catch (err) {
        res.status(400).send({ error: "Error : " + err.message });
    }
});
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await user_1.default.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.comparePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 3 * 60 * 60 * 1000,
                sameSite: "lax",
                path: "/"
            });
            res.send(user);
        }
        else {
            throw new Error("Invalid credentials");
        }
    }
    catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});
authRouter.post("/logout", async (_req, res) => {
    res.cookie("token", "", {
        expires: new Date(Date.now()),
    });
    res.send("Logout successful!!!");
});
exports.default = authRouter;
