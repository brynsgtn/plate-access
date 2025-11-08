// Import dependencies
import express from "express";
import { pool } from "../lib/db.js";

// Import controllers
import {
    viewAllLogs,
    entryLogLPR,
    exitLogLPR,
    entryLogManual,
    exitLogManual,
    archiveOldLogs,
    getArchivedLogs
} from "../controllers/log.controller.js";

// Import middleware
import { authorizeRoles, protectRoute } from "../middlewares/auth.middleware.js";

// Initialize Express router
const router = express.Router();

// Log routes
router.get("/view-logs", viewAllLogs); // add protect middleware to implement who created the log
router.post("/entry-log-lpr", protectRoute, entryLogLPR);
router.post("/exit-log-lpr", protectRoute, exitLogLPR);
router.post("/entry-log-manual", protectRoute, entryLogManual);
router.post("/exit-log-manual", protectRoute, exitLogManual);
router.post("/archive-old-logs", protectRoute, authorizeRoles("itAdmin"), archiveOldLogs);
router.get("/get-old-logs", protectRoute, authorizeRoles("itAdmin"), getArchivedLogs);

// Export router
export default router;