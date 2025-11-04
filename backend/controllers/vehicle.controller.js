// Import Vehicle Model
import Vehicle from "../models/vehicle.model.js";

// View vehicle controller
export const viewVehicles = async (req, res) => {
    try {
        // Fetch all vehicles with populated user references
        const vehicles = await Vehicle.find({})
            .populate('addedBy', 'username email') // Populate addedBy field
            .populate('updateRequest.requestedBy', 'username email') // Populate updateRequest.requestedBy field
            .populate('blacklistedBy', 'username email') // Populate blacklistedBy field
            .populate('unblacklistedBy', 'username email') // Populate unblacklistedBy field
            .populate('bannedBy', 'username email') // Populate bannedBy field


        // Respond with the list of vehicles
        res.status(200).json({ vehicles });
    } catch (error) {
        // Handle errors
        console.error("Error in viewVehicles controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

function removeAllWhitespace(plateNumber) {
    return plateNumber.replace(/\s+/g, "").toUpperCase();
}
// Add vehicle controller
export const addVehicle = async (req, res) => {
    const { plateNumber, makeModel, ownerName } = req.body;
    console.log(req.user)
    const isAdmin = req.user.role === "admin";
    const userId = req.user._id

    // Validate request body
    if (!plateNumber || !makeModel || !ownerName) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const cleanedPlateNumber = removeAllWhitespace(plateNumber);
    // Check if vehicle already exists
    const existingVehicle = await Vehicle.findOne({ plateNumber: cleanedPlateNumber });
    if (existingVehicle) {
        return res.status(400).json({ message: "Vehicle already exists" });
    }

    try {
        // Create a new vehicle

        // If admin, set isApproved to true
        const newVehicle = new Vehicle({
            plateNumber: cleanedPlateNumber,
            makeModel,
            ownerName,
            branch: req.user.branch,
            isApproved: isAdmin ? true : false,
            addedBy: userId
        });
        // Save the vehicle to the database
        await newVehicle.save();

        // Respond with the created vehicle
        res.status(201).json({
            message: isAdmin ? "Vehicle added successfully" : "Vehicle registration request sent",
            vehicle: newVehicle
        });
    } catch (error) {
        // Handle errors
        console.error("Error in addVehicle controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update vehicle controller
export const updateVehicle = async (req, res) => {
    const { plateNumber, makeModel, ownerName, id, branch } = req.body;

    // Validate request body
    if (!plateNumber || !makeModel || !ownerName || !id || !branch) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const cleanedPlateNumber = removeAllWhitespace(plateNumber);

    try {
        // Find the vehicle by id
        const vehicle = await Vehicle.findOne({ _id: id });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Update vehicle details
        vehicle.plateNumber = cleanedPlateNumber;
        vehicle.makeModel = makeModel;
        vehicle.ownerName = ownerName;
        vehicle.branch = branch;

        // Save the updated vehicle
        await vehicle.save();

        // Respond with the updated vehicle
        res.status(200).json({
            message: "Vehicle updated successfully",
            vehicle
        });
    } catch (error) {
        // Handle errors
        console.error("Error in updateVehicle controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Archive vehicle controller
export const archiveUnarchiveVehicle = async (req, res) => {
    const { id } = req.body;
    const reqUser = req.user;

    try {
        // Validate request body
        if (!id) {
            return res.status(400).json({ message: "Vehicle ID is required" });
        }

        // Check if user is admin
        if (!reqUser.role === "admin") {
            return res.status(403).json({ message: "Only admin can archive/unarchive vehicles" });
        }

        // Find the vehicle by id
        const vehicle = await Vehicle.findOne({ _id: id });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Archive/unarchive the vehicle
        if (vehicle.isArchived) {
            vehicle.isArchived = false;
        } else {
            vehicle.isArchived = true;
        }
        await vehicle.save();

        // Respond with a success message
        res.status(200).json({ message: "Vehicle " + (vehicle.isArchived ? "archived" : "unarchived") + " successfully" });
    } catch (error) {
        // Handle errors
        console.error("Error in archiveUnarchiveVehicle controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Blacklist or unblacklist vehicle
export const blackListOrUnblacklistVehicle = async (req, res) => {
    const { id, reason } = req.body;
    const reqUser = req.user;

    // Validate request body
    if (!id) {
        return res.status(400).json({ message: "Vehicle ID is required" });
    }

    if (!reason) {
        return res.status(400).json({ message: "Reason is required" });
    }

    try {
        // Find the vehicle by id
        const vehicle = await Vehicle.findOne({ _id: id });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Toggle the isBlacklisted status
        vehicle.isBlacklisted = !vehicle.isBlacklisted;

        // Update the isBlacklistedAt field if the vehicle is blacklisted
        if (vehicle.isBlacklisted) {
            vehicle.unblacklistedBy = null;
            vehicle.unblacklistedAt = null;
            vehicle.unblacklistReason = null;
            vehicle.isBlacklistedAt = new Date();
            vehicle.blacklistedBy = reqUser._id;
            vehicle.blacklistReason = reason;
        } else {
            vehicle.isBlacklistedAt = null;
            vehicle.blacklistedBy = null;
            vehicle.blacklistReason = null;
            vehicle.unblacklistedBy = reqUser._id;
            vehicle.unblacklistedAt = new Date();
            vehicle.unblacklistReason = reason;
        }

        // Save the updated vehicle
        await vehicle.save();

        // Respond with the updated vehicle
        res.status(200).json({
            message: `Vehicle ${vehicle.isBlacklisted ? "blacklisted" : "unblacklisted"} successfully`,
            vehicle
        });
    } catch (error) {
        // Handle errors
        console.error("Error in blackListOrUnblacklistVehicle controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Ban vehicle controller
export const banVehicle = async (req, res) => {
    const { id, reason } = req.body;
    const reqUser = req.user;

    // Validate request body
    if (!id) {
        return res.status(400).json({ message: "Vehicle ID is required" });
    }

    if (!reason) {
        return res.status(400).json({ message: "Reason is required" });
    }

    // Check if user is admin
    if (reqUser.role !== "admin") {
        return res.status(403).json({ message: "Only admin can ban vehicles" });
    }

    try {
        // Find the vehicle by id
        const vehicle = await Vehicle.findOne({ _id: id });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // If vehicle is banned, unban it
        if (vehicle.isBanned) {
            return res.status(400).json({ message: "Vehicle is already banned" });
        }

        // If vehicle is not banned, ban it
        vehicle.isBanned = true;
        vehicle.bannedBy = reqUser._id;
        vehicle.bannedReason = reason;
        vehicle.bannedAt = new Date();

        // Save the updated vehicle
        await vehicle.save();

        return res.status(200).json({
            message: `Vehicle banned successfully!`,
            vehicle
        });
    } catch (error) {
        // Handle errors
        console.error("Error in banVehicle controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Approve vehicle registration request
export const approveVehicleRequest = async (req, res) => {
    const { id } = req.body;

    // Check if the user is an admin
    if (!req.user.role === "admin") {
        return res.status(403).json({ message: "Only admins can approve vehicle requests" });
    }

    // Validate request body
    if (!id) {
        return res.status(400).json({ message: "Vehicle ID is required" });
    }

    try {
        // Find the vehicle by id
        const vehicle = await Vehicle.findOne({ _id: id });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Approve the vehicle
        vehicle.isApproved = true;

        // Save the updated vehicle
        await vehicle.save();

        // Respond with the updated vehicle
        res.status(200).json({
            message: "Vehicle approved successfully",
            vehicle
        });
    } catch (error) {
        // Handle errors
        console.error("Error in approveVehicleRequest controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Deny vehicle registration request
export const denyVehicleRequest = async (req, res) => {
    const { id } = req.body;

    // Validate request body
    if (!id) {
        return res.status(400).json({ message: "Vehicle ID is required" });
    }

    // Check if the user is an admin
    if (!req.user.role === "admin") {
        return res.status(403).json({ message: "Only admins can deny vehicle requests" });
    }

    try {
        // Find the vehicle by id
        const vehicle = await Vehicle.findOne({ _id: id });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Check if status is approved
        if (vehicle.isApproved) {
            return res.status(400).json({ message: "Vehicle is already approved" });
        }

        // Delete the vehicle
        await vehicle.deleteOne();

        // Respond with a success message
        res.status(200).json({ message: "Vehicle denied successfully" });
    } catch (error) {
        // Handle errors
        console.error("Error in denyVehicleRequest controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};

// Request vehicle update controller
export const requestUpdateVehicle = async (req, res) => {
    const { id, makeModel, ownerName, plateNumber, branch, reason } = req.body;
    const reqUser = req.user;
    try {
        // Validate request body
        if (!id || !makeModel || !ownerName || !plateNumber || !branch) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const cleanedPlateNumber = removeAllWhitespace(plateNumber);

        if (reqUser.role === "admin") {
            return res.status(403).json({ message: "Admins don't need to request vehicle updates" });
        }

        // Find the vehicle by id
        const vehicle = await Vehicle.findById(id);

        // Check if vehicle exists
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Ensure vehicle is approved
        if (!vehicle.isApproved) {
            return res.status(400).json({ message: "Vehicle registration must be approved before updating" });
        }

        // Check if there is already a pending update request
        if (vehicle.updateRequest && vehicle.updateRequest.status === 'pending') {
            return res.status(400).json({ message: "There is already a pending update request for this vehicle" });
        }

        // Create a new update request
        vehicle.updateRequest = {
            requestedPlateNumber: cleanedPlateNumber,
            requestedModelAndMake: makeModel,
            requestedOwnerName: ownerName,
            requestedBranch: branch,
            requestedBy: reqUser.id,
            reason: reason ? reason : `Requesting update for ${cleanedPlateNumber}`,
            status: 'pending',
        };

        await vehicle.save();

        res.status(200).json({
            message: "Vehicle update request submitted successfully",
            vehicle
        });
    } catch (error) {
        console.error("Error in requestUpdateVehicle controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Approve vehicle update request controller
export const approveUpdateVehicleRequest = async (req, res) => {
    const { id } = req.body;

    try {
        // Validate request body
        if (!id) {
            return res.status(400).json({ message: "Vehicle ID is required" });
        }

        // Find the vehicle by id
        const vehicle = await Vehicle.findById(id);

        // Check if vehicle exists and has an update request
        if (!vehicle || !vehicle.updateRequest) {
            return res.status(404).json({ message: "Vehicle not found or update request not found" });
        }

        // Update the vehicle details
        vehicle.plateNumber = vehicle.updateRequest.requestedPlateNumber || vehicle.plateNumber;
        vehicle.makeModel = vehicle.updateRequest.requestedModelAndMake || vehicle.makeModel;
        vehicle.ownerName = vehicle.updateRequest.requestedOwnerName || vehicle.ownerName;
        vehicle.branch = vehicle.updateRequest.requestedBranch || vehicle.branch;

        // Clear the update request
        vehicle.updateRequest = null;

        // Save the updated vehicle
        await vehicle.save();

        // Respond with the updated vehicle
        res.status(200).json({
            message: "Vehicle update request approved successfully",
            vehicle
        });
    } catch (error) {
        console.error("Error in updateVehicleRequest controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Reject vehicle update request controller
export const rejectUpdateVehicleRequest = async (req, res) => {
    const { id } = req.body;

    try {
        // Validate request body
        if (!id) {
            return res.status(400).json({ message: "Vehicle ID is required" });
        }

        // Find the vehicle by id
        const vehicle = await Vehicle.findById(id);

        // Check if vehicle exists and has an update request
        if (!vehicle || !vehicle.updateRequest) {
            return res.status(404).json({ message: "Vehicle not found or update request not found" });
        }

        // Clear the update request
        vehicle.updateRequest = null;

        // Save the updated vehicle
        await vehicle.save();

        // Respond with the updated vehicle
        res.status(200).json({
            message: "Vehicle update request rejected successfully",
            vehicle
        });
    } catch (error) {
        console.error("Error in updateVehicleRequest controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

