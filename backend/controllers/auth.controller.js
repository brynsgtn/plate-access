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
            console.log("loginUser controller : Either Username or Email and Password are required")
            return res.status(400).json({ message: "Either Username or Email and Password are required" });
        }

        // Defines a variable if a user exists or not.
        const userExists = await User.findOne([{ username }, { email }]);

        if (!userExists) {
            // If user doesn't exist logs a message into the console and returns status code of 400 (bad request)
            console.log("loginUser : User does not exist");
            res.status(400).json({ message: "User does not exist" });
        };

    } catch (error) {

    }
};
// Logout controller
export const logoutUser = async (req, res) => {
    res.send("Logout user");
};