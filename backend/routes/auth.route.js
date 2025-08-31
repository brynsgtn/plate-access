// Import dependencies
import express from "express";

// Import controllers
import { loginUser, logoutUser } from "../controllers/auth.controller.js";

// Initialize Express router
const router = express.Router();

// Authentication routes
router.post("/login", loginUser); // Route for user log in
router.post("/logout", logoutUser); // Route for user log out

// Export router
export default router;