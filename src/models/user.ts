import mongoose, { Schema, Model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IUserDocument } from "../types/user";

const userSchema = new Schema<IUserDocument>({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
        trim: true,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        minLength: 5,
        maxLength: 50,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "other"],
            message: "no ther gender is allowed"
        },
    },
    photoUrl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    skills: {
        type: [String],
    },
    about: {
        type: String,
        default: "Hey there! I'm using DevConnect. Let's connect and share our knowledge and experiences in the world of development.",
    }
}, {
    timestamps: true,
});

userSchema.methods.getJWT = async function (this: IUserDocument): Promise<string> {
    const user = this;
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is not defined");
    }
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    return token;
};

userSchema.methods.comparePassword = async function (this: IUserDocument, passwordInputByUser: string): Promise<boolean> {
    const user = this;
    if (!user.password) {
        return false;
    }
    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        user.password
    );
    return isPasswordValid;
};

const User: Model<IUserDocument> = mongoose.model<IUserDocument>("User", userSchema);
export default User;
