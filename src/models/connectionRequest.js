const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        enum:{
            values:["ignored","accepted","rejected","interested"],
            message:"Status value must be either ignored, accepted, rejected or interested",
        }
    }
},
{
    timestamps:true,
}
);
const ConnectionRequestModel = mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports = ConnectionRequestModel;
