const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
        // validate(value){
        //     if(!validator.isEmail(value)){
        //         throw new Error("Email is not valid");
        //     }
        // }
    },
    password:{
        type:String,
        required:true,
        // validate(value){
        //     if(!validator.isStrongPassword(value)){
        //         throw new Error("Password is not strong enough");
        //     }
        // }
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        enum:{
            values:["male","female","other"],
            message:"no ther gender is allowed"
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

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    return token;
};

userSchema.methods.comparePassword = async function (passwordInputByUser) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        user.password
    );
    return isPasswordValid;
};

const User = mongoose.model("User",userSchema);
module.exports = User;
