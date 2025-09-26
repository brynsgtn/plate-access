// Import dependencies
import express from "express";

// Import controllers
import { 
    viewAllLogs, 
    entryLogLPR
 } from "../controllers/log.controller.js";

// Initialize Express router
const router = express.Router();

// Log routes
router.get("/view-logs", viewAllLogs);
router.post("/entry-log-lpr", entryLogLPR);

// Export router
export default router;