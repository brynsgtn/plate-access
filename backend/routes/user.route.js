// Import dependencies
import express from "express";

// Import controllers
import { register, updateUser, deleteUser } from "../controllers/user.controller.js";
// Initialize Express router
const router = express.Router();

// User routes
router.get("/register", register);

router.get("/update", updateUser);

router.get("/delete", deleteUser);

// Export router
export default router;