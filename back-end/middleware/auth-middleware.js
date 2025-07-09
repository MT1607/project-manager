import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authMiddware = (req, res, next) => {
    try {
        const token = req.header.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({message: "Unauthorized"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({message: "Unauthorized"});
        }
        req.user = user;
        next();
    } catch (e) {
        console.log("error: ", e);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export default authMiddleware;