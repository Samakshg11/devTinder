import express, { Request, Response, Router } from "express";
import { userauth } from "../middlewares/auth";
import { validateEditProfileData } from "../utils/validation";

const profileRouter: Router = express.Router();

profileRouter.get("/profile/view", userauth, async (req: Request, res: Response): Promise<any> => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("Error fetching user profile");
    }
});

profileRouter.patch("/profile/edit", userauth, async (req: Request, res: Response): Promise<any> => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid edit request");
        }
        const loggedInuser = req.user;
        if (!loggedInuser) {
            return res.status(401).send("Unauthorized");
        }
        console.log("Logged in user:", loggedInuser);
        Object.keys(req.body).forEach((key) => {
            (loggedInuser as any)[key] = req.body[key];
        });
        console.log("Logged in user:", loggedInuser);

        await loggedInuser.save();
        res.json({ message: "Profile updated successfully", data: loggedInuser });
    } catch (err) {
        console.log("Error updating profile:", err);
        res.status(400).send("Error updating profile");
    }
});

export default profileRouter;
