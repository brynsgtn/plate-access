import Vehicle from "../models/vehicle.model.js";
import Log from "../models/log.model.js";

// View logs controller
export const viewAllLogs = async (req, res) => {
    try {
        const logs = await Log.find().populate("vehicle");
        res.json(logs);
    } catch (error) {
        console.error("Error in viewLogs controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Entry log controller
export const entryLogLPR = async (req, res) => {
    const { plateNumber } = req.body;

    try {
        if (!plateNumber) {
            return res.status(400).json({ message: "Plate number is required" });
        }

        // First, check if it’s a registered vehicle
        const vehicle = await Vehicle.findOne({ plateNumber });

        if (vehicle) {
            // Case 1: Blacklisted
            if (vehicle.isBlacklisted) {
                const log = await Log.create({
                    vehicle: vehicle._id,
                    plateNumber,
                    gateType: "entrance",
                    method: "LPR",
                    success: false,
                    notes: "Blacklisted registered vehicle"
                });
                return res.status(403).json({ message: "Vehicle is blacklisted", log });
            }

            // Case 2: Not approved
            if (!vehicle.isApproved) {
                const log = await Log.create({
                    vehicle: vehicle._id,
                    plateNumber,
                    gateType: "entrance",
                    method: "LPR",
                    success: false,
                    notes: "Pending vehicle registration approval"
                });
                return res.status(400).json({ message: "Pending vehicle registration approval", log });
            }

            // Case 3: Success
            const log = await Log.create({
                vehicle: vehicle._id,
                plateNumber,
                gateType: "entrance",
                method: "LPR",
                success: true,
                notes: "Verified by LPR"
            });
            return res.status(201).json({ message: "Entry granted", log });
        }

        // Case 4: Unregistered vehicle
        const log = await Log.create({
            plateNumber,
            gateType: "entrance",
            method: "LPR",
            success: false,
            notes: "Unregistered vehicle"
        });
        return res.status(403).json({ message: "Unregistered vehicle", log });


    } catch (error) {
        console.error("Error in entryLog controller:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Exit log controller
export const exitLog = async (req, res) => {
    const { plateNumber } = req.body;

    try {
        if (!plateNumber) {
            return res.status(400).json({ message: "Plate number is required" });
        }

        const vehicle = await Vehicle.findOne({ plateNumber });

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }


        const exitLog = await Log.create({
            vehicle: vehicle._id,
            gateType: "exit",
            action: "open",
            success: true,
            method: "LPR",
            timestamp: new Date(),
            notes: "Verified by LPR",
        });

        res.status(201).json(exitLog);

    } catch (error) {
        console.error("Error in exitLog controller:", error);
        res.status(500).json({ message: "Server error" });
    }
}