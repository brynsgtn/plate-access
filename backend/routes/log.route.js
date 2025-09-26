// Import dependencies
import express from "express";

// Import controllers
import { 
    viewLogs, 
    entryLog
 } from "../controllers/log.controller.js";

// Initialize Express router
const router = express.Router();

// Log routes
router.get("/", viewLogs);
router.post("/log-entry", entryLog);

// Export router
export default router;