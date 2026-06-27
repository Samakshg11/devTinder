import mongoose, { Schema, Document, Types } from "mongoose";

export interface IConnectionRequest extends Document {
  fromUserId: Types.ObjectId;
  toUserId: Types.ObjectId;
  status: "ignored" | "accepted" | "rejected" | "interested";
  createdAt?: Date;
  updatedAt?: Date;
}

const connectionRequestSchema = new Schema<IConnectionRequest>({
    fromUserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "accepted", "rejected", "interested"],
            message: "Status value must be either ignored, accepted, rejected or interested",
        }
    }
},
{
    timestamps: true,
}
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (this: IConnectionRequest) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
      throw new Error("Cannot send connection request to yourself");
    }
});

const ConnectionRequestModel = mongoose.model<IConnectionRequest>("ConnectionRequest", connectionRequestSchema);
export default ConnectionRequestModel;
