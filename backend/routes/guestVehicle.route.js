// Import dependencies
import express from "express";


// Import controllers
import {
    viewGuestVehicles,
    addGuestVehicle,
    extendGuestVehicle,
    deleteGuestVehicle
} from "../controllers/guestVehicle.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

// Initialize Express router
const router = express.Router();

// Guest vehicle routes
router.get("/view-guest-vehicles", protectRoute, viewGuestVehicles);
router.post("/add-guest-vehicle", protectRoute, addGuestVehicle);
router.patch("/extend-guest-vehicle", protectRoute, extendGuestVehicle);
router.delete("/delete-guest-vehicle", protectRoute, deleteGuestVehicle);

// Export router
export default router;