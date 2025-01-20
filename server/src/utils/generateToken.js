import jwt from "jsonwebtoken";
import { ApiResponse } from "./ApiResponse.js";
import { ApiError } from "./ApiError.js";

export const generateToken = (res, user, message) => {
    try {
        const token = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure only in production
            maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
        };

        return res
            .status(200)
            .cookie("token", token, options)
            .json(new ApiResponse(200, user, message));
    } catch (error) {
        console.error("Error generating token:", error);
        throw new ApiError(500,"Error during generating token")
    }
};