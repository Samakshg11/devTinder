import express, { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import { validateSignupData } from "../utils/validation";

const authRouter: Router = express.Router();

authRouter.post("/signup", async (req: Request, res: Response): Promise<any> => {
    try {
        //validation of data
        validateSignupData(req);
        const { firstName, lastName, emailId, password } = req.body;
        //encrypt the password
        const passswordHash = await bcrypt.hash(password, 10);
    
        const user = new User({
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
    catch (err: any) {
        res.status(400).send({ error: "Error : " + err.message });
    }
});
    
authRouter.post("/login", async (req: Request, res: Response): Promise<any> => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
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
    catch (err: any) {
        res.status(400).send("Error : " + err.message);
    }
});

authRouter.post("/logout", async (_req: Request, res: Response): Promise<any> => {
    res.cookie("token", "", {
        expires: new Date(Date.now()),
    });
    res.send("Logout successful!!!");
});

export default authRouter;
