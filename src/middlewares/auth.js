const adminauth = (req,res,next) =>{
    console.log("This is the admin auth middleware");
    const token ="xyz";
    const isadminAuth = token === "xyz";
    if(!isadminAuth){
        res.status(401).send("unauthorized");;
    }
    else{
        next();
    }
};
const userauth = (req,res,next) =>{
    console.log("This is the user auth middleware");
    const token ="xyz";
    const isadminAuth = token === "xyz";
    if(!isadminAuth){
        res.status(401).send("unauthorized");;
    }
    else{
        next();
    }
};

module.exports = {adminauth,userauth};