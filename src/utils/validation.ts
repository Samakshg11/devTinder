import { Request } from "express";
import validator from "validator";

export const validateSignupData = (req: Request): void => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email format");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password!");
    }
};

export const validateEditProfileData = (req: Request): boolean => {
    const allowedFields = [
        "firstName",
        "lastName",
        "emailId",
        "about",
        "age",
        "skills",
        "photoUrl",
        "gender"
    ];
    const isEditAllowed = Object.keys(req.body || {}).every((field) => allowedFields.includes(field));
    return isEditAllowed;
};
