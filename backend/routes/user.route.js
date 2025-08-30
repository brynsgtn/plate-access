// Import dependencies
import express from "express";

// Import controllers
import { registerUser, updateUser, deleteUser } from "../controllers/user.controller.js";
// Initialize Express router
const router = express.Router();

// TODO - add middleware for admin only access
// User routes
router.post("/register", registerUser); // Route for user registration (ADMIN ONLY)
router.get("/update", updateUser); // Route for updating user (ADMIN ONLY)
router.get("/delete", deleteUser); // Route for deleting user (ADMIN ONLY)

// Export router
export default router;