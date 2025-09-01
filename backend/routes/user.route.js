// Import dependencies
import express from "express";

// Import controllers
import { registerUser, updateUser, deleteUser } from "../controllers/user.controller.js";

// Import middleware
import { adminRoute, protectRoute } from "../middlewares/auth.middleware.js";

// Initialize Express router
const router = express.Router();

// User routes
router.post("/register", protectRoute, adminRoute, registerUser); // Route for user registration (ADMIN ONLY)
router.get("/update", protectRoute, adminRoute, updateUser); // Route for updating user (ADMIN ONLY)
router.get("/delete", protectRoute, adminRoute, deleteUser); // Route for deleting user (ADMIN ONLY)

// Export router
export default router;