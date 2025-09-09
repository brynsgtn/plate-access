// Import dependencies
import express from "express";

// Import controllers
import { 
    registerUser, 
    updateUser, 
    deleteUser, 
    getUsers 
} from "../controllers/user.controller.js";

// Import middleware
import { adminRoute, protectRoute } from "../middlewares/auth.middleware.js";

// Initialize Express router
const router = express.Router();

// User routes
router.get("/get-users", protectRoute, adminRoute, getUsers); // Route for getting all users except current user (ADMIN ONLY)
router.post("/register", protectRoute, adminRoute, registerUser); // Route for user registration (ADMIN ONLY)
router.patch("/update", protectRoute, adminRoute, updateUser); // Route for updating user (ADMIN ONLY)
router.delete("/delete", protectRoute, adminRoute, deleteUser); // Route for deleting user (ADMIN ONLY)

// Export router
export default router;