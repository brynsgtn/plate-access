// Import Vehicle Model
import Vehicle from "../models/Vehicle.model.js";

// View vehicle controller
export const viewVehicle = async (req, res) => {
    res.send("Vehicle route");
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