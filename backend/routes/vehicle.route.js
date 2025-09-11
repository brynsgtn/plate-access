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
    approveUpdateVehicleRequest,
    requestDeleteVehicle,
    approveDeleteVehicleRequest
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
router.put("/request-delete-vehicle", protectRoute, requestDeleteVehicle);
router.patch("/blacklist-unblacklist-vehicle", protectRoute, blackListOrUnblacklistVehicle);
router.patch("/approve-add-vehicle-request", protectRoute, adminRoute, approveVehicleRequest);
router.patch("/approve-update-vehicle-request", protectRoute, adminRoute, approveUpdateVehicleRequest);
router.delete("/delete-vehicle", protectRoute, adminRoute, deleteVehicle);
router.delete("/approve-delete-vehicle-request", protectRoute, adminRoute, approveDeleteVehicleRequest);

// Export router
export default router;