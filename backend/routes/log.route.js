// Import dependencies
import express from "express";

// Import controllers
import {
    viewAllLogs,
    entryLogLPR,
    exitLogLPR,
    entryLogManual,
    exitLogManual
} from "../controllers/log.controller.js";

// Initialize Express router
const router = express.Router();

// Log routes
router.get("/view-logs", viewAllLogs); // add protect middleware to implement who created the log
router.post("/entry-log-lpr", entryLogLPR);
router.post("/exit-log-lpr", exitLogLPR);
router.post("/entry-log-manual", entryLogManual);
router.post("/exit-log-manual", exitLogManual);

// Export router
export default router;