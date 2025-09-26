// Import dependencies
import express from "express";

// Import controllers
import { 
    viewAllLogs, 
    entryLog
 } from "../controllers/log.controller.js";

// Initialize Express router
const router = express.Router();

// Log routes
router.get("/view-logs", viewAllLogs);
router.post("/log-entry", entryLog);

// Export router
export default router;