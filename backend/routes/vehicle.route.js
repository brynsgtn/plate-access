// Import dependencies
import express from "express";

// Import controllers
import { 
    viewVehicles, 
    addVehicle, 
    updateVehicle, 
    blackListOrUnblacklistVehicle, 
    approveVehicleRequest, 
    requestUpdateVehicle,
    archiveUnarchiveVehicle,
    approveUpdateVehicleRequest,
    denyVehicleRequest,
    rejectUpdateVehicleRequest,
    banVehicle
} from "../controllers/vehicle.controller.js";

// Import middleware
import { protectRoute, authorizeRoles } from "../middlewares/auth.middleware.js";

// Initialize Express router
const router = express.Router();

// Vehicle routes

// View all approved vehicles (for users)
router.get("/view-vehicle", protectRoute, viewVehicles);

// Add a new vehicle (user or admin, approval required for non-admin)
router.post("/add-vehicle", protectRoute, addVehicle);

// Update vehicle details (admin only)
router.put("/update-vehicle", protectRoute, authorizeRoles("admin"), updateVehicle);

// Request to update a vehicle (user, requires admin approval)
router.put("/request-update-vehicle", protectRoute, requestUpdateVehicle);

// Blacklist or unblacklist a vehicle (admin only for unblacklist)
router.patch("/blacklist-unblacklist-vehicle", protectRoute, blackListOrUnblacklistVehicle);

// Approve add vehicle request (admin only)
router.patch("/approve-add-vehicle-request", protectRoute, authorizeRoles("admin"), approveVehicleRequest);

// Approve update vehicle request (admin only)
router.patch("/approve-update-vehicle-request", protectRoute, authorizeRoles("admin"), approveUpdateVehicleRequest);

// Reject update vehicle request (admin only)
router.patch("/reject-update-vehicle-request", protectRoute, authorizeRoles("admin"), rejectUpdateVehicleRequest);

// Archive a vehicle (admin only)
router.patch("/archive-unarchive-vehicle", protectRoute, authorizeRoles("admin"), archiveUnarchiveVehicle);

// Ban a vehicle (admin only)
router.patch("/ban-vehicle", protectRoute, authorizeRoles("admin"), banVehicle);

// Deny vehicle registration request (admin only)
router.delete("/deny-vehicle-request", protectRoute, authorizeRoles("admin"), denyVehicleRequest);

// Export router
export default router;