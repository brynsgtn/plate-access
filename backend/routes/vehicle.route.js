// Import dependencies
import express from "express";

// Import controllers
import { viewVehicle, addVehicle } from "../controllers/vehicle.controller.js";

// Import middleware
import { protectRoute } from "../middlewares/auth.middleware.js";

// Initialize Express router
const router = express.Router();

// Vehicle routes
router.get("/view-vehicle", protectRoute, viewVehicle);
router.post("/add-vehicle", protectRoute, addVehicle);

// Export router
export default router;