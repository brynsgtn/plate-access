// Import dependencies
import express from "express";

// Import controllers
import { viewVehicle } from "../controllers/vehicle.controller.js";
// Initialize Express router
const router = express.Router();

// Vehicle routes
router.get("/", viewVehicle);

// Export router
export default router;