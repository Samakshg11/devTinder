"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEditProfileData = exports.validateSignupData = void 0;
const validator_1 = __importDefault(require("validator"));
const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    }
    else if (!validator_1.default.isEmail(emailId)) {
        throw new Error("Invalid email format");
    }
    else if (!validator_1.default.isStrongPassword(password)) {
        throw new Error("Please enter a strong password!");
    }
};
exports.validateSignupData = validateSignupData;
const validateEditProfileData = (req) => {
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
exports.validateEditProfileData = validateEditProfileData;
