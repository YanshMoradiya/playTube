import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";


const verifyToken = asyncHandler(async (req, res, next) => {

    const token = req.cookies?.accessToken || req.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "unauthorized request.");
    }

    const decodedToken = jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

    const user = await User.findById(decodedToken._id);

    if (!user) {
        throw new ApiError(401, "Invalid access.");
    }

    req.user = user;
    next();
});

export { verifyToken };