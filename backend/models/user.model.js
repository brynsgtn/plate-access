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
        // User role: parkingStaff, admin, or itAdmin
        role: {
            type: String,
            enum: ["parkingStaff", "admin", "itAdmin"],
            default: "parkingStaff",
        },
        // User's branch
        branch: {
            type: String,
            enum: ["Main Branch", "North Branch", "South Branch"],
            required: [true, "Branch is required"],
        },
        // User's active status
        isActive: {
            type: Boolean,
            default: true,
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

// Custom method to check if the entered plain text password
userSchema.methods.comparePassword = async function (password) {
    // "this" refers to the user document calling this method.
    // "password" is the plain text password the user typed when logging in.

    // bcrypt.compare will hash the plain password and check if it matches
    // the hashed password stored in the database.
    return bcrypt.compare(password, this.password);
};

// Converts user schema into a Model and store in User variable
const User = mongoose.model("User", userSchema);

// Export User
export default User;