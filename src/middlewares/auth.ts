import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

interface IDecodedToken {
  _id: string;
}

export const userauth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Unauthorized: No token provided");
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET environment variable is not defined");
        }

        const decodedToken = jwt.verify(token, jwtSecret) as IDecodedToken;
        const { _id } = decodedToken;
        const user = await User.findById(_id);

        if (!user) {
            throw new Error("User not found");
        }

        req.user = user;
        next();
    } catch (err: any) {
        res.status(401).send("Unauthorized : " + err.message);
    }
};
