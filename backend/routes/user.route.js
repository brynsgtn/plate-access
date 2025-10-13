// Import dependencies
import express from "express";

// Import controllers
import { 
    registerUser, 
    updateUser, 
    deactivateOrActivateUser, 
    getUsers,
    updateUserBranch
} from "../controllers/user.controller.js";

// Import middleware
import { authorizeRoles, protectRoute } from "../middlewares/auth.middleware.js";

// Initialize Express router
const router = express.Router();

// User routes
router.get("/get-users", protectRoute, authorizeRoles("itAdmin", "admin"), getUsers); // Route for getting all users except current user (ADMIN and IT ADMIN ONLY)
router.post("/register", protectRoute, authorizeRoles("itAdmin"), registerUser); // Route for user registration (IT ADMIN ONLY)
router.patch("/update", protectRoute, authorizeRoles("itAdmin"),updateUser); // Route for updating user (IT ADMIN ONLY)
router.patch("/update-user-branch", protectRoute, authorizeRoles("itAdmin"), updateUserBranch); // Route for updating user (IT ADMIN ONLY)
router.patch("/deactivate-or-activate", protectRoute, authorizeRoles("itAdmin"), deactivateOrActivateUser); // Route for deleting user (IT ADMIN ONLY)

// Export router
export default router;