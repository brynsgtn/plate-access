// Import dependencies
import express from "express";

// Import controllers
import { register, updateUser, deleteUser } from "../controllers/user.controller.js";
// Initialize Express router
const router = express.Router();

// User routes
router.get("/register", register); // Register user route
router.get("/update", updateUser); // Update user route
router.get("/delete", deleteUser); // Delete user route

// Export router
export default router;