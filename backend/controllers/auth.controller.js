// Import User model
import User from "../models/user.model.js";

// Login controller
export const loginUser = async (req, res) => {
    // Destructures variables from request body
    const { username, email, password } = req.body;

    try {
        // If neither username nor email is provided, OR password is missing
        if ((!username && !email) || !password) {
            // If true logs message in console and returns status code of 400 (bad request)
            console.log("loginUser controller : Either username or email and password are required")
            return res.status(400).json({ message: "Either username or email and password are required" });
        }

        // Defines a variable if a user exists or not.
        const user = await User.findOne({
            $or: [{ username }, { email }]
        });

        // Checks if user exist and password matched the hashed password
        if (user && (user.comparePassword(password))) {
            // If true returns status code 200 (success) and json data (_id, name, email, and isAdmin)
            res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin
            });
        } else {
            // If invalid credentials (username/email or password) logs a message into the console and returns status code of 400 (bad request)
            console.log("loginUser : Invalid credentials");
            res.status(400).json({ message: "Invalid credentials" });
        };

    } catch (error) {
        // Logs error message in terminal
        console.log("Error in loginUser controller", error.message);
        // Returns status 500 (Internal Server Error) and the error message
        res.status(500).json({ message: error.message });
    }
};
// Logout controller
export const logoutUser = async (req, res) => {
    res.send("Logout user");
};