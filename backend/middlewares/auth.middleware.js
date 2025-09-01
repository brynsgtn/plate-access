// Import dependency
import jwt from "jsonwebtoken";

//Import user model
import User from "../models/user.model.js";

// Middleware to protect routes that require authentication
export const protectRoute = async (req, res, next) => {
    try {
        // 1. Get the JWT token from cookies
        const token = req.cookies.jwt;

        // If no token is found, deny access
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        };

        // 2. Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If verification fails or token is invalid, deny access
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        };

        // 3. Find the user in the database using the userId from the token payload
        // Exclude the password field for security
        const user = await User.findById(decoded.userId).select("-password");

        // If no user is found, return 404
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        };

        // 4. Attach user data to request object for access in next middleware or route
        req.user = user;
        req.userId = user._id;

        // 5. Call next middleware or controller
        next();

    } catch (error) {
        // Handle unexpected errors
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
