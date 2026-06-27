import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  if (!process.env.DB_CONNECTION_SECRET) {
    throw new Error("DB_CONNECTION_SECRET environment variable is not defined");
  }
  await mongoose.connect(process.env.DB_CONNECTION_SECRET, {
    serverSelectionTimeoutMS: 5000,
  });
};

export default connectDB;
