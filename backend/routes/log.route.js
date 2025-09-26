// Import dependencies
import express from "express";

// Import controllers
import { 
    viewAllLogs, 
    entryLogLPR,
    exitLogLPR
 } from "../controllers/log.controller.js";

// Initialize Express router
const router = express.Router();

// Log routes
router.get("/view-logs", viewAllLogs);
router.post("/entry-log-lpr", entryLogLPR);
router.post("/exit-log-lpr", exitLogLPR);

// Export router
export default router;