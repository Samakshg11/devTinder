const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userauth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Unauthorized: No token provided");
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedToken;
        const user = await User.findById(_id);

        if (!user) {
            throw new Error("User not found");
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).send("Unauthorized : " + err.message);
    }
};

module.exports = {userauth};
