// Import User model
import User from "../models/user.model.js";

// Import utility function
import { generateToken } from "../lib/utils.js";

// Function that checks if a user is logged in
export const checkAuth = async (req, res) => {
    try {
        // Defines a variable if a user exists or not.
        const user = await User.findById(req.userId).select("-password");

        // Check if user exists
        if (!user) {
            // If user does not exist logs message in console and returns status code of 400 (bad request)
            return res.status(400).json({ message: "User not found" });
        }

        // If user exists return status code of 200 (success) and success message
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            branch: user.branch,
            createdAt: user.createdAt,
            isActive: user.isActive
        });
    } catch (error) {
        // Logs error message in terminal
        console.log("Error in loginUser controller", error.message);
        // Returns status 500 (Internal Server Error) and the error message
        res.status(500).json({ message: error.message });
    }
};

// Login controller
export const loginUser = async (req, res) => {
    // Destructures variables from request body
    const { usernameOrEmail, password } = req.body;

    const MAX_ATTEMPTS = 5;
    const LOCK_TIME = 10 * 60 * 1000; // 10 minutes


    try {
        // If neither username nor email is provided, OR password is missing
        if (!usernameOrEmail || !password) {
            return res.status(400).json({ message: "Either username/email or password are required" });
        }

        // Defines a variable if a user exists or not.
        const user = await User.findOne({
            $or: [{ 'email': usernameOrEmail }, { 'username': usernameOrEmail }]
        });

        // If no user found, return generic invalid creds
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if account is temporarily locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            const remainingMinutes = Math.ceil((user.lockUntil - Date.now()) / 60000);
            return res.status(403).json({
                message: `Too many failed attempts, try again in ${remainingMinutes} minute(s).`
            });
        }


        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            user.failedLoginAttempts += 1;

            // If max attempts reached, lock account temporarily
            if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
                user.lockUntil = new Date(Date.now() + LOCK_TIME);
                user.failedLoginAttempts = 0; // reset after locking
            }

            await user.save();
            return res.status(400).json({ message: "Invalid credentials" });
        }


        // If user is inactive
        if (!user.isActive) {
            return res.status(400).json({ message: "User is not active, please contact IT admin" });
        }

        // Successful login: reset attempts and lock
        user.failedLoginAttempts = 0;
        user.lockUntil = null;
        user.lastLogin = new Date();
        await user.save();

        // Generate a JWT for the logged-in user and store it in a secure HTTP-only cookie
        generateToken(user._id, user.role, res);

        // Returns status code 200 (success) and json data (_id, name, email, and isAdmin)
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            branch: user.branch,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        });
    }
    catch (error) {
        // Logs error message in terminal
        console.log("Error in loginUser controller", error.message);
        // Returns status 500 (Internal Server Error) and the error message
        res.status(500).json({ message: error.message });
    }
};
// Logout controller
export const logoutUser = async (req, res) => {
    // This function logs out a user by clearing the JWT cookie
    try {
        // Set the "jwt" cookie to an empty string and expire it immediately
        // This effectively removes the cookie from the browser
        res.cookie("jwt", "", { maxAge: 0 });

        // Send a success response to the client
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        // If an error occurs, log it and send a 500 Internal Server Error response
        console.log("Error in logoutUser controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};