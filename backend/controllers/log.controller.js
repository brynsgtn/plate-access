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

export const entryLog = async (req, res) => {
    const { plateNumber } = req.body;

    try {
        if (!plateNumber) {
            return res.status(400).json({ message: "Plate number is required" });
        }

        const vehicle = await Vehicle.findOne({ plateNumber });

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        if (vehicle.isApproved === false) {
            return res.status(400).json({ message: "Vehicle is not approved" });
        }

        if (vehicle.isBlacklisted) {
            const entryLog = await Log.create({
                vehicle: vehicle._id,
                gateType: "entrance",
                action: "fail",
                success: false,
                method: "LPR",
                timestamp: new Date(),
                notes: "Verified by LPR",
            });

            res.status(201).json(entryLog);
        }

        const entryLog = await Log.create({
            vehicle: vehicle._id,
            gateType: "entrance",
            action: "open",
            success: true,
            method: "LPR",
            timestamp: new Date(),
            notes: "Verified by LPR",
        });

        res.status(201).json(entryLog);

    } catch (error) {
        console.error("Error in entryLog controller:", error);
        res.status(500).json({ message: "Server error" });
    }
}