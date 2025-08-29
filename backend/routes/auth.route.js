// Import dependencies
import express from "express";

// Import controllers
import { loginUser, logoutUser } from "../controllers/auth.controller.js";

// Initialize Express router
const router = express.Router();

// Authentication routes
router.get("/login", loginUser); // Routes for user log in
router.get("/logout", logoutUser); // Routes for user log out

// Export router
export default router;