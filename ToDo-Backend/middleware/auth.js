const jwt = require('jsonwebtoken');

//Middleware to authenticate requests using JWT.
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if(!token) {
        return res.status(401).json({ message: "No token, authorization denied!!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = authMiddleware;