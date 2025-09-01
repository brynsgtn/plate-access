// Import dependencies
import express from "express";

// Import controllers
import {
    checkAuth,
    loginUser,
    logoutUser
} from "../controllers/auth.controller.js";

// Import middleware
import { protectRoute } from "../middlewares/auth.middleware.js";

// Initialize Express router
const router = express.Router();

// Authentication routes
router.get("/check-auth", protectRoute, checkAuth);
router.post("/login", loginUser); // Route for user log in
router.post("/logout", logoutUser); // Route for user log out

// Export router
export default router;