"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    if (!process.env.DB_CONNECTION_SECRET) {
        throw new Error("DB_CONNECTION_SECRET environment variable is not defined");
    }
    await mongoose_1.default.connect(process.env.DB_CONNECTION_SECRET, {
        serverSelectionTimeoutMS: 5000,
    });
};
exports.default = connectDB;
