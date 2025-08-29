// Import dependencies
import express from "express";

// Import controllers
import { login, logout } from "../controllers/auth.controller.js";

// Initialize Express router
const router = express.Router();

// Authentication routes
router.get("/login", login); // Routes for user log in
router.get("/logout", logout);// Routes for user log in

// Export router
export default router;