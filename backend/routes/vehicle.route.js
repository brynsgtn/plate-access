// Import dependencies
import express from "express";

// Import controllers
import { viewVehicles, addVehicle, updateVehicle } from "../controllers/vehicle.controller.js";

// Import middleware
import { protectRoute } from "../middlewares/auth.middleware.js";

// Initialize Express router
const router = express.Router();

// Vehicle routes
router.get("/view-vehicle", protectRoute, viewVehicles);
router.post("/add-vehicle", protectRoute, addVehicle);
router.put("/update-vehicle", protectRoute, updateVehicle);

// Export router
export default router;