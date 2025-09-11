// Import dependencies
import express from "express";

// Import controllers
import { 
    viewVehicles, 
    addVehicle, 
    updateVehicle, 
    blackListOrUnblacklistVehicle, 
    viewVehicleRequests, 
    approveVehicleRequest, 
    viewBlacklistedVehicles, 
    requestUpdateVehicle,
    deleteVehicle,
    approveUpdateVehicle,
} from "../controllers/vehicle.controller.js";

// Import middleware
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";

// Initialize Express router
const router = express.Router();

// Vehicle routes
router.get("/view-vehicle", protectRoute, viewVehicles);
router.get("/view-add-vehicle-requests", protectRoute, adminRoute, viewVehicleRequests);
router.get("/view-blacklisted-vehicles", protectRoute, adminRoute, viewBlacklistedVehicles);
router.post("/add-vehicle", protectRoute, addVehicle);
router.put("/update-vehicle", protectRoute, adminRoute, updateVehicle);
router.put("/request-update-vehicle", protectRoute, requestUpdateVehicle);
router.patch("/blacklist-unblacklist-vehicle", protectRoute, blackListOrUnblacklistVehicle);
router.patch("/approve-add-vehicle-request", protectRoute, adminRoute, approveVehicleRequest);
router.patch("/approve-update-vehicle-request", protectRoute, adminRoute, approveUpdateVehicle);
router.delete("/delete-vehicle", protectRoute, adminRoute, deleteVehicle);

// Export router
export default router;