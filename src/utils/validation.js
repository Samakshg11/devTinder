const validator = require('validator');
const validateSignupData = (req) => {
    
    const {firstName,lastName,emailId,password} = req.body;
    if(!firstName || !lastName){
        throw new Error( "Name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid email format");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error( "Please enter a strong password!");
    }
}
const validateEditProfileData = (req) => {
    const allowedFields = ["firstName",
        "lastName",
        "emailId",
        "about",
        "age",
        "skills",
        "photoUrl",
        "gender"
    ];
    const isEditAllowed = Object.keys(req.body).every((feild)=>allowedFields.includes(feild));
    return isEditAllowed;
}

module.exports = {
    validateSignupData,
    validateEditProfileData
};