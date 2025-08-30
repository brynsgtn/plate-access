// Import dependencies
import mongoose from "mongoose";

// Definition of user schema
const userSchema = new Schema(
    {
        // User's fullname
        name: {
            type: String,
            required: [true, "Name is required"]
        },
        // User's email address
        email: {
            type: String,
            required: [true, "Email is required"],
        },
        // User's password
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
        },
        // User's role (admin - true, parking staff - false)
        isAdmin: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true, // Created at, updated at, etc..
    }
);

// Converts user schema into a Model and store in User variable
const User = mongoose.model("User", userSchema);

// Export User
export default User;