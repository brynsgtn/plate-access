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
        req.isAdmin = user.role === "admin";
        req.isItAdmin = user.role === "itAdmin";
        req.branch = user.branch;
        // 5. Call next middleware or controller
        next();

    } catch (error) {
        // Handle unexpected errors
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
// Middleware to restrict access to admin-only routes
// export const adminRoute = (req, res, next) => {
//     try {
//         // 1. Check if the user has admin privileges
//         const isAdmin = req.user.isAdmin;

//         // 2. If not admin, deny access with 403 Forbidden
//         if (!isAdmin) {
//             return res.status(403).json({ message: "Forbidden - Admin Access Required" });
//         };

//         //  If admin, allow access
//         next();

//     } catch (error) {
//         // Handle unexpected errors
//         console.log("Error in adminRoute middleware", error.message);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// Middleware to restrict access to admin-only routes
// Accepts one or more roles allowed for the route
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            const userRole = req.user.role; // Get role from user object

            // Check if user role is in the allowedRoles list
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ message: "Forbidden - Access Denied" });
            }

            // Role is allowed, proceed
            next();

        } catch (error) {
            console.log("Error in authorizeRoles middleware", error.message);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};
