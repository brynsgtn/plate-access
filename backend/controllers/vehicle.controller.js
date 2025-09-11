// Import Vehicle Model
import Vehicle from "../models/Vehicle.model.js";

// View vehicle controller
export const viewVehicles = async (req, res) => {
    try {
        // Fetch all vehicles
        const vehicles = await Vehicle.find({ isApproved: true });
        const totalVehicles = await Vehicle.countDocuments({ isApproved: true });
        // Respond with the list of vehicles
        res.status(200).json({ vehicles, totalVehicles });
    } catch (error) {
        // Handle errors
        console.error("Error fetching vehicles:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add vehicle controller
export const addVehicle = async (req, res) => {
    const { plateNumber, makeModel, ownerName } = req.body;
    console.log(req.user)
    const isAdmin = req.user.isAdmin;

    // Validate request body
    if (!plateNumber || !makeModel || !ownerName) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if vehicle already exists
    const existingVehicle = await Vehicle.findOne({ plateNumber });
    if (existingVehicle) {
        return res.status(400).json({ message: "Vehicle already exists" });
    }

    try {
        // Create a new vehicle

        // If admin, set isApproved to true
        if (isAdmin) {
            const newVehicle = new Vehicle({
                plateNumber,
                makeModel,
                ownerName,
                isApproved: true
            });

            // Save the vehicle to the database
            await newVehicle.save();

            // Respond with the created vehicle
            res.status(201).json({
                message: "Vehicle added successfully",
                vehicle: newVehicle
            });
        } else {
            // If not admin, set isApproved to false
            const newVehicle = new Vehicle({
                plateNumber,
                makeModel,
                ownerName,
            });
            // Save the vehicle to the database
            await newVehicle.save();

            // Respond with the created vehicle
            res.status(201).json({
                message: "Vehicle added successfully",
                vehicle: newVehicle
            });
        };
    } catch (error) {
        // Handle errors
        console.error("Error adding vehicle:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update vehicle controller
export const updateVehicle = async (req, res) => {
    const { plateNumber, makeModel, ownerName, id } = req.body;

    // Validate request body
    if (!plateNumber || !makeModel || !ownerName || !id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Find the vehicle by id
        const vehicle = await Vehicle.findOne({ _id: id });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Update vehicle details
        vehicle.plateNumber = plateNumber;
        vehicle.makeModel = makeModel;
        vehicle.ownerName = ownerName;

        // Save the updated vehicle
        await vehicle.save();

        // Respond with the updated vehicle
        res.status(200).json({
            message: "Vehicle updated successfully",
            vehicle
        });
    } catch (error) {
        // Handle errors
        console.error("Error updating vehicle:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteVehicle = async (req, res) => {
    const { id } = req.body;
    const reqUser = req.user;

    // Validate request body
    if (!id) {
        return res.status(400).json({ message: "Vehicle ID is required" });
    }

    if (!reqUser.isAdmin) {
        return res.status(403).json({ message: "Only admin can delete vehicles with requests" });
    }

    try {
        // Find the vehicle by id
        const vehicle = await Vehicle.findOne({ _id: id });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Delete the vehicle
        await Vehicle.deleteOne({ _id: id });

        // Respond with a success message
        res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        // Handle errors
        console.error("Error deleting vehicle:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Blacklist or unblacklist vehicle
export const blackListOrUnblacklistVehicle = async (req, res) => {
    const { id } = req.body;

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

        // Toggle the isBlacklisted status
        vehicle.isBlacklisted = !vehicle.isBlacklisted;

        // Save the updated vehicle
        await vehicle.save();

        // Respond with the updated vehicle
        res.status(200).json({
            message: `Vehicle ${vehicle.isBlacklisted ? "blacklisted" : "unblacklisted"} successfully`,
            vehicle
        });
    } catch (error) {
        // Handle errors
        console.error("Error blacklisting/unblacklisting vehicle:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// View blacklisted vehicles
export const viewBlacklistedVehicles = async (req, res) => {
    try {
        // Find all blacklisted vehicles
        const blacklistedVehicles = await Vehicle.find({ isBlacklisted: true });
        const totalBlacklistedVehicles = await Vehicle.countDocuments({ isBlacklisted: true }); // Get the total
        res.status(200).json({
            message: "Blacklisted vehicles retrieved successfully",
            blacklistedVehicles,
            totalBlacklistedVehicles
        });
    } catch (error) {
        // Handle errors
        console.error("Error viewing blacklisted vehicles:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// View vehicle requests
export const viewVehicleRequests = async (req, res) => {
    try {
        // Find all vehicle requests
        const vehicleRequests = await Vehicle.find({ isApproved: false });
        const totalRequests = await Vehicle.countDocuments({ isApproved: false }); ``

        // Respond with the vehicle requests
        res.status(200).json({
            message: "Vehicle requests retrieved successfully",
            vehicleRequests,
            totalRequests
        });
    } catch (error) {
        // Handle errors
        console.error("Error viewing vehicle requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Approve vehicle registration request
export const approveVehicleRequest = async (req, res) => {
    const { id } = req.body;

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
        console.error("Error approving vehicle:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const requestUpdateVehicle = async (req, res) => {
    const { id, makeModel, ownerName } = req.body;

    // Validate request body
    if (!id || !makeModel || !ownerName) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Find the vehicle by id and update the request
    const vehicle = await Vehicle.findByIdAndUpdate(id, {
        updateRequest: {
            makeModel,
            ownerName,
            requestedBy: req.user.id,
            requestedAt: Date.now(),
            reason: `Requesting update for vehicle: ${makeModel}, ${ownerName}`,
            status: 'pending'
        }
    },
        {
            new: true
        }
    );

    // Check if the vehicle was found and updated
    if(!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
    }

    if(!vehicle.isApproved) {
        return res.status(400).json({ message: "Vehicle registration must be approved before updating" });
    }

    // Respond with the updated vehicle
    res.status(200).json({
        message: "Vehicle update request submitted successfully",
        vehicle
    });
}