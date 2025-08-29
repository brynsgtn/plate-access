// Import dependencies
import express from "express";

// Import controllers
import { viewLogs } from "../controllers/log.controller.js";

// Initialize Express router
const router = express.Router();

// Log routes
router.get("/", viewLogs);

// Export router
export default router;