export interface ISendMessagePayload {
  firstName: string;
  userId: string;
  targetUserId: string;
  text: string;
}

export interface ISendConnectionRequestPayload {
  fromUserId: string;
  toUserId: string;
  status: "ignored" | "interested";
}

export interface IReviewRequestPayload {
  requestId: string;
  status: "accepted" | "rejected";
}

export interface ISocketEvents {
  sendConnectionRequest: ISendConnectionRequestPayload;
  reviewRequest: IReviewRequestPayload;
  sendMessage: ISendMessagePayload;
}
