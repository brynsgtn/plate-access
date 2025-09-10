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
