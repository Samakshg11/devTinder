const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:50,
        trim:true,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        minLength:5,
        maxLength:50,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        },
    },
    photoUrl:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    skills:{
        type:[String],
    },
    about:{
        type:String,
        default:"Hey there! I'm using DevConnect. Let's connect and share our knowledge and experiences in the world of development.",
    }
},{
    timestamps:true,
});
const User = mongoose.model("User",userSchema);
module.exports = User;
