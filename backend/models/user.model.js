// Import dependencies
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Definition of user schema
const userSchema = new mongoose.Schema(
    {
        // User's fullname
        username: {
            type: String,
            required: [true, "Name is required"],
            minlength: [6, "Username must be at least 6 characters long"],
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


// Pre-save hook to hash password before saving to database
userSchema.pre("save", async function (next) {
    // "this" refers to the document being saved (a user in this case).

    // If the password field has NOT been changed, just continue.
    if (!this.isModified("password")) return next();

    try {
        // Generate a salt (extra randomness for better security).
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt.
        this.password = await bcrypt.hash(this.password, salt);
        // Continue saving the document.
        next();
    } catch (error) {
        // If something goes wrong, pass the error to Mongoose.
        next(error);

    };
});

// TODO - Custom method to compare password

// Converts user schema into a Model and store in User variable
const User = mongoose.model("User", userSchema);

// Export User
export default User;