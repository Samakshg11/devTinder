import { Document, Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  firstName: string;
  lastName?: string;
  emailId: string;
  password?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  photoUrl?: string;
  about?: string;
  skills?: string[];
  connectionRequests?: any[]; // optional array for requests
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends Document, Omit<IUser, "_id"> {
  _id: Types.ObjectId;
  getJWT(): Promise<string>;
  comparePassword(passwordInputByUser: string): Promise<boolean>;
}
