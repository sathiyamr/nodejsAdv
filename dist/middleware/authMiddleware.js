import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
const protect = asyncHandler(async (req, res, next) => {
    const authRequest = req;
    let token;
    token = authRequest.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "");
            const user = await User.findById(decoded.userId).select("-password");
            if (!user) {
                res.status(401);
                throw new Error("Not authorized, user not found");
            }
            authRequest.user = user;
            next();
        }
        catch (error) {
            console.error(error);
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }
    else {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});
export { protect };
//# sourceMappingURL=authMiddleware.js.map