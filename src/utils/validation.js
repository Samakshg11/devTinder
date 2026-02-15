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
        throw new Error( "Password must be at least 8 characters long and contain a mix of uppercase, lowercase, numbers, and symbols");
    }
}
module.exports = {validateSignupData};