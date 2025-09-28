import Vehicle from "../models/vehicle.model.js";
import GuestVehicle from "../models/guestVehicle.model.js";
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
                    blacklistHit: true,
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

        // Check if it’s a guest vehicle
        const guestVehicle = await GuestVehicle.findOne({ plateNumber });


        if (guestVehicle) {

            // Case 4: Blacklisted
            if (guestVehicle.isBlacklisted) {
                const log = await Log.create({
                    vehicle: guestVehicle._id,
                    plateNumber,
                    gateType: "entrance",
                    method: "LPR",
                    success: false,
                    blacklistHit: true,
                    isGuest: true,
                    notes: "Blacklisted guest vehicle"
                });
                return res.status(403).json({ message: "Guest vehicle is blacklisted", log });
            }

            // Case 5: Access expired
            if (guestVehicle.validUntil < new Date()) {
                const log = await Log.create({
                    vehicle: guestVehicle._id,
                    plateNumber,
                    gateType: "entrance",
                    method: "LPR",
                    success: false,
                    isGuest: true,
                    notes: "Guest vehicle access expired"
                });
                return res.status(403).json({ message: "Guest vehicle access expired", log });
            }

            // Case 6: Success
            const log = await Log.create({
                vehicle: guestVehicle._id,
                plateNumber,
                gateType: "entrance",
                method: "LPR",
                success: true,
                isGuest: true,
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
        console.error("Error in entryLogLPR controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Exit log controller
export const exitLogLPR = async (req, res) => {
    const { plateNumber } = req.body;

    try {
        if (!plateNumber) {
            return res.status(400).json({ message: "Plate number is required" });
        }

        // First, check if it’s a registered vehicle
        const vehicle = await Vehicle.findOne({ plateNumber });

        if (vehicle) {


            // Case 1: Success
            const log = await Log.create({
                vehicle: vehicle._id,
                plateNumber,
                gateType: "exit",
                method: "LPR",
                success: true,
                notes: "Verified by LPR"
            });
            return res.status(201).json({ message: "Exit granted", log });
        }

        // Case 2: Unrecognized Plate
        const log = await Log.create({
            plateNumber,
            gateType: "exit",
            method: "LPR",
            success: false,
            notes: "Unrecognized Plate Number"
        });
        return res.status(403).json({ message: "Unrecognized Plate Number, please enter plate number manually", log });

    } catch (error) {
        console.error("Error in exitLogLPR controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Manual entrance log controller
export const entryLogManual = async (req, res) => {
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
                    method: "manual",
                    success: false,
                    blacklistHit: true,
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
                    method: "manual",
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
                method: "manual",
                success: true,
                notes: "Verified by manual entry"
            });
            return res.status(201).json({ message: "Entry granted", log });
        }

        // Case 4: Unregistered vehicle                    
        const log = await Log.create({
            plateNumber,
            gateType: "entrance",
            method: "manual",
            success: false,
            notes: "Unregistered vehicle"
        });
        return res.status(403).json({ message: "Unregistered vehicle", log });
    } catch (error) {
        console.error("Error in entranceLogManual controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Manual exit log controller
export const exitLogManual = async (req, res) => {
    const { plateNumber } = req.body;

    try {
        if (!plateNumber) {
            return res.status(400).json({ message: "Plate number is required" });
        }

        // First, check if it’s a registered vehicle
        const vehicle = await Vehicle.findOne({ plateNumber }); // check if it's a registered vehicle

        if (vehicle) {
            // Case 1: Success
            const log = await Log.create({
                vehicle: vehicle._id,
                plateNumber,
                gateType: "exit",
                method: "manual",
                success: true,
                notes: "Verified by manual entry"
            });
            return res.status(201).json({ message: "Exit granted", log });
        }

        // Case 2: Unrecognized Plate
        const log = await Log.create({
            plateNumber,
            gateType: "exit",
            method: "manual",
            success: false,
            notes: "Unrecognized Plate Number"
        });
        return res.status(403).json({ message: "Unrecognized Plate Number, please open the gate manually", log });
    } catch (error) {
        console.error("Error in exitLogManual controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};