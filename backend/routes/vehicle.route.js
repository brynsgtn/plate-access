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
    approveDeleteVehicleRequest,
    viewUpdateAndDeleteVehicleRequests,
    denyVehicleRequest,
    rejectUpdateVehicleRequest,
    rejectDeleteVehicleRequest,
    requestBlacklistVehicle
} from "../controllers/vehicle.controller.js";

// Import middleware
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";

// Initialize Express router
const router = express.Router();

// Vehicle routes

// View all approved vehicles (for users)
router.get("/view-vehicle", protectRoute, viewVehicles);

// View all pending add vehicle requests (admin only)
router.get("/view-add-vehicle-requests", protectRoute, adminRoute, viewVehicleRequests);

// View all blacklisted vehicles (admin only)
router.get("/view-blacklisted-vehicles", protectRoute, adminRoute, viewBlacklistedVehicles);

// View all pending update and delete vehicle requests (admin only)
router.get("/view-update-and-delete-vehicle-requests", protectRoute, adminRoute, viewUpdateAndDeleteVehicleRequests);

// Add a new vehicle (user or admin, approval required for non-admin)
router.post("/add-vehicle", protectRoute, addVehicle);

// Update vehicle details (admin only)
router.put("/update-vehicle", protectRoute, adminRoute, updateVehicle);

// Request to update a vehicle (user, requires admin approval)
router.put("/request-update-vehicle", protectRoute, requestUpdateVehicle);

// Request to delete a vehicle (user, requires admin approval)
router.put("/request-delete-vehicle", protectRoute, requestDeleteVehicle);

// Request to blacklist a vehicle (user, requires admin approval)
router.put("/request-blacklist-vehicle", protectRoute, requestBlacklistVehicle);

// Blacklist or unblacklist a vehicle (admin only)
router.patch("/blacklist-unblacklist-vehicle", protectRoute, blackListOrUnblacklistVehicle);

// Approve add vehicle request (admin only)
router.patch("/approve-add-vehicle-request", protectRoute, adminRoute, approveVehicleRequest);

// Approve update vehicle request (admin only)
router.patch("/approve-update-vehicle-request", protectRoute, adminRoute, approveUpdateVehicleRequest);

// Reject update vehicle request (admin only)
router.patch("/reject-update-vehicle-request", protectRoute, adminRoute, rejectUpdateVehicleRequest);

// Reject delete vehicle request (admin only)
router.patch("/reject-delete-vehicle-request", protectRoute, adminRoute, rejectDeleteVehicleRequest);

// Delete a vehicle (admin only)
router.delete("/delete-vehicle", protectRoute, adminRoute, deleteVehicle);

// Approve delete vehicle request (admin only)
router.delete("/approve-delete-vehicle-request", protectRoute, adminRoute, approveDeleteVehicleRequest);

// Deny vehicle registration request (admin only)
router.delete("/deny-vehicle-request", protectRoute, adminRoute, denyVehicleRequest);

// Export router
export default router;