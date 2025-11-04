// Import dependencies
import express from "express";


// Import controllers
import {
    viewGuestVehicles,
    addGuestVehicle,
    extendGuestVehicle,
    archiveUnarchiveGuestVehicle,
    blacklistOrUnblacklistGuestVehicle,
    banGuestVehicle,
} from "../controllers/guestVehicle.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

// Initialize Express router
const router = express.Router();

// Guest vehicle routes
router.get("/view-guest-vehicles", protectRoute, viewGuestVehicles);
router.post("/add-guest-vehicle", protectRoute, addGuestVehicle);
router.patch("/extend-guest-vehicle-access", protectRoute, extendGuestVehicle);
router.patch("/blacklist-or-unblacklist-guest-vehicle", protectRoute, blacklistOrUnblacklistGuestVehicle);
router.patch("/archive/unarchive-guest-vehicle", protectRoute, archiveUnarchiveGuestVehicle);
router.patch("/ban-guest-vehicle", protectRoute, banGuestVehicle);

// Export router
export default router;