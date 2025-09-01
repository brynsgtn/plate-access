// Import User model
import User from "../models/user.model.js";

// Import utility function
import { generateToken } from "../lib/utils.js";

// Register user controller
export const registerUser = async (req, res) => {
    // Destructures variables from request body
    const { username, email, password } = req.body;

    try {
        // Checks if all fields are present
        if (!username || !email || !password) {

            // If not logs message in console and returns status code of 400 (bad request)
            console.log("registerUser controller : All fields are required")
            return res.status(400).json({ message: "All fields are required" });
        };

        // Defines a variable if a user exists or not.
        const userExists = await User.findOne({ email });

        if (userExists) {
            // If user exists returns status code of 400 (bad request)
            console.log(email)
            return res.status(400).json({ message: "User already exists" });
        };

        // If passed all checks create a user
        const user = await User.create({ username, email, password });

        // Generate a JWT for the logged-in user and store it in a secure HTTP-only cookie
        generateToken(user._id, res);

        // Return status code 201 (created) and json data (_id, name, email, and isAdmin)
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } catch (error) {
        // Logs error message in terminal
        console.log("Error in registerUser controller", error.message);
        // Returns status 500 (Internal Server Error) and the error message
        res.status(500).json({ message: error.message });
    };
};

// Get users controller
export const getUsers = async (req, res) => {
    try {

        // 1. Get the userId from the request object
        const userId = req.userId;
        
        // 2. Fetch all users from the database except the current user, excluding the password field for security
        const users = await User.find({_id: { $ne: userId }}).select("-password");

        // 3. Send the list of users with a 200 OK status
        res.status(200).json(users);
    } catch (error) {
        // 4. Log any errors and send a 500 Internal Server Error response
        console.log("Error in getUsers controller", error.message);
        res.status(500).json({ message: error.message });
    }
};

// Update user controller
export const updateUser = async (req, res) => {
    res.send("Update user");
};
// Delete user controller
export const deleteUser = async (req, res) => {
    res.send("Delete user");
};