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

// Import middleware
import { protectRoute } from "../middlewares/auth.middleware.js";

// Initialize Express router
const router = express.Router();

// Log routes
router.get("/view-logs", viewAllLogs); // add protect middleware to implement who created the log
router.post("/entry-log-lpr", protectRoute, entryLogLPR);
router.post("/exit-log-lpr", protectRoute, exitLogLPR);
router.post("/entry-log-manual", protectRoute, entryLogManual);
router.post("/exit-log-manual", protectRoute, exitLogManual);

// Export router
export default router;