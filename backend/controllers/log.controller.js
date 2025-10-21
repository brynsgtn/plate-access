import Vehicle from "../models/vehicle.model.js";
import GuestVehicle from "../models/guestVehicle.model.js";
import Log from "../models/log.model.js";
import { io } from "../lib/socket.js";

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

function removeAllWhitespace(plateNumber) {
    return plateNumber.replace(/\s+/g, "").toUpperCase();
}

// Entry log controller
export const entryLogLPR = async (req, res) => {
    const { plates, branch } = req.body; // plates is an array

    if (!plates || !Array.isArray(plates) || plates.length === 0) {
        return res.status(400).json({ message: "No plate data provided" });
    }

    try {

        // Get the first object in the array
        const firstPlateObj = plates[0];

        // Get the plate text
        const plateText = firstPlateObj.text;
        const confidence = firstPlateObj.avg_conf;

        const cleanedPlateNumber = removeAllWhitespace(plateText);

        // Find the last log for this plate
        const lastLog = await Log.findOne({ plateNumber: cleanedPlateNumber })
            .sort({ timestamp: -1 });

        if (lastLog && lastLog.gateType === "entrance" && lastLog.success) {
            return res.status(400).json({
                message: "Vehicle has not exited yet. Cannot enter again.",
            });
        }

        // Registered vehicle
        const vehicle = await Vehicle.findOne({ plateNumber: cleanedPlateNumber });
        if (vehicle) {
            if (vehicle.isBlacklisted) {
                const log = await Log.create({
                    vehicle: vehicle._id,
                    plateNumber: cleanedPlateNumber,
                    branch: branch,
                    gateType: "entrance",
                    method: "LPR",
                    confidence: confidence,
                    success: false,
                    blacklistHit: true,
                    notes: "Blacklisted registered vehicle"
                });
                io.emit("newLog", log);
                return res.status(403).json({ message: "Vehicle is blacklisted", log });
            }

            if (!vehicle.isApproved) {
                const log = await Log.create({
                    vehicle: vehicle._id,
                    plateNumber: cleanedPlateNumber,
                    branch: branch,
                    gateType: "entrance",
                    method: "LPR",
                    confidence: confidence,
                    success: false,
                    notes: "Pending approval"
                });
                io.emit("newLog", log);
                return res.status(400).json({ message: "Pending vehicle registration approval", log });
            }

            const log = await Log.create({
                vehicle: vehicle._id,
                plateNumber: cleanedPlateNumber,
                branch: branch,
                gateType: "entrance",
                confidence: confidence,
                method: "LPR",
                success: true,
                notes: "Verified by LPR"
            });
            io.emit("newLog", log);
            return res.status(201).json({ message: "Entry granted", log });
        }

        // Guest vehicle
        const guestVehicle = await GuestVehicle.findOne({ plateNumber: cleanedPlateNumber });
        if (guestVehicle) {
            if (guestVehicle.isBlacklisted) {
                const log = await Log.create({
                    vehicle: guestVehicle._id,
                    plateNumber: cleanedPlateNumber,
                    branch: branch,
                    gateType: "entrance",
                    method: "LPR",
                    confidence: confidence,
                    success: false,
                    blacklistHit: true, isGuest: true, 
                    notes: "Blacklisted guest vehicle"
                });
                io.emit("newLog", log);
                return res.status(201).json({ message: "Vehicle is blacklisted", log });
            }

            if (guestVehicle.validUntil < new Date()) {
                const log = await Log.create({
                    vehicle: guestVehicle._id,
                    plateNumber: cleanedPlateNumber,
                    branch: branch,
                    gateType: "entrance",
                    method: "LPR",
                    confidence: confidence,
                    success: false,
                    isGuest: true,
                    notes: "Guest vehicle access expired"

                });
                io.emit("newLog", log);
                return res.status(403).json({ message: "Guest vehicle access expired", log });
            }

            const log = await Log.create({
                vehicle: guestVehicle._id,
                plateNumber: cleanedPlateNumber,
                branch: branch,
                gateType: "entrance",
                method: "LPR",
                confidence: confidence,
                success: true,
                isGuest: true,
                notes: "Verified by LPR"

            });
            io.emit("newLog", log);
            // For a successful entrance
            return res.status(201).json({ message: "Entry granted", log });
        }

        // Unregistered vehicle
        const log = await Log.create({
            plateNumber: cleanedPlateNumber,
            branch: branch,
            gateType: "entrance",
            method: "LPR",
            confidence: confidence,
            success: false,
            notes: "Unregistered vehicle"
        });
        io.emit("newLog", log);
        return res.status(403).json({ message: "Unregistered vehicle", log });
    }
    catch (error) {
        console.error("Error in entryLogLPR controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};



// Exit log controller
export const exitLogLPR = async (req, res) => {
    const { plates, branch } = req.body; // plates is an array

    if (!plates || !Array.isArray(plates) || plates.length === 0) {
        return res.status(400).json({ message: "No plate data provided" });
    }

    try {

        // Get the first object in the array
        const firstPlateObj = plates[0];
        // Get the confidence
        const confidence = firstPlateObj.avg_conf;
        // Get the plate text
        const plateText = firstPlateObj.text;

        const cleanedPlateNumber = removeAllWhitespace(plateText);

        // Find the last log for this plate
        const lastLog = await Log.findOne({ plateNumber: cleanedPlateNumber })
            .sort({ timestamp: -1 });

        // If there’s no previous entrance or last log was already an exit
        if (!lastLog || lastLog.gateType === "exit") {
            return res.status(400).json({
                message: "Vehicle cannot exit without an active entrance record.",
            });
        }


        // First, check if it’s a registered vehicle
        const vehicle = await Vehicle.findOne({ plateNumber: cleanedPlateNumber });

        if (vehicle) {


            // Case 1: Success
            const log = await Log.create({
                vehicle: vehicle._id,
                plateNumber: cleanedPlateNumber,
                branch: branch,
                gateType: "exit",
                method: "LPR",
                confidence: confidence,
                success: true,
                notes: "Verified by LPR"
            });
            io.emit("newLog", log); // Emit the new log
            return res.status(201).json({ message: "Exit granted", log });
        }

        const guestVehicle = await GuestVehicle.findOne({ plateNumber: cleanedPlateNumber }); // check if it's a guest vehicle

        if (guestVehicle) {
            // Case 2: Success
            const log = await Log.create({
                vehicle: guestVehicle._id,
                plateNumber: cleanedPlateNumber,
                branch: branch,
                gateType: "exit",
                method: "LPR",
                confidence: confidence,
                success: true,
                isGuest: true,
                notes: "Verified by LPR"
            });
            io.emit("newLog", log); // Emit the new log
            return res.status(201).json({ message: "Exit granted for guest vehicle", log });
        }

        // Case 3: Unrecognized Plate
        const log = await Log.create({
            plateNumber: cleanedPlateNumber,
            branch: branch,
            gateType: "exit",
            method: "LPR",
            confidence: confidence,
            success: false,
            notes: "Unrecognized Plate Number"
        });
        io.emit("newLog", log); // Emit the new log
        return res.status(403).json({ message: "Unrecognized Plate Number, please enter plate number manually", log });

    } catch (error) {
        console.error("Error in exitLogLPR controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Manual entrance log controller
export const entryLogManual = async (req, res) => {
    const { plateNumber } = req.body;
    const currentUserBranch = req.user.branch;

    try {
        if (!plateNumber) {
            return res.status(400).json({ message: "Plate number is required" });
        }

        const cleanedPlateNumber = removeAllWhitespace(plateNumber);

        // Find the last log for this plate
        const lastLog = await Log.findOne({ plateNumber: cleanedPlateNumber })
            .sort({ timestamp: -1 });

        // If the last log exists and was an entrance (no exit yet)
        if (lastLog && lastLog.gateType === "entrance" && lastLog.success) {
            return res.status(400).json({
                message: "Vehicle has not exited yet. Cannot enter again.",
            });
        }

        // First, check if it’s a registered vehicle
        const vehicle = await Vehicle.findOne({ plateNumber: cleanedPlateNumber });

        if (vehicle) {
            // Case 1: Blacklisted
            if (vehicle.isBlacklisted) {
                const log = await Log.create({
                    vehicle: vehicle._id,
                    plateNumber: cleanedPlateNumber,
                    branch: currentUserBranch,
                    gateType: "entrance",
                    method: "manual",
                    success: false,
                    blacklistHit: true,
                    notes: "Blacklisted"
                });
                io.emit("newLog", log); // Emit the new log
                return res.status(403).json({ message: "Vehicle is blacklisted", log });
            }

            // Case 2: Not approved
            if (!vehicle.isApproved) {
                const log = await Log.create({
                    vehicle: vehicle._id,
                    plateNumber: cleanedPlateNumber,
                    branch: currentUserBranch,
                    gateType: "entrance",
                    method: "manual",
                    success: false,
                    notes: "Pending registration"
                });
                io.emit("newLog", log); // Emit the new log
                return res.status(400).json({ message: "Pending vehicle registration approval", log });
            }

            // Case 3: Success
            const log = await Log.create({
                vehicle: vehicle._id,
                plateNumber: cleanedPlateNumber,
                branch: currentUserBranch,
                gateType: "entrance",
                method: "manual",
                success: true,
                notes: "Verified by manual entry"
            });
            io.emit("newLog", log); // Emit the new log
            return res.status(201).json({ message: "Entry granted", log });
        }

        // Check if it’s a guest vehicle
        const guestVehicle = await GuestVehicle.findOne({ plateNumber: cleanedPlateNumber });


        if (guestVehicle) {

            // Case 4: Blacklisted
            if (guestVehicle.isBlacklisted) {
                const log = await Log.create({
                    vehicle: guestVehicle._id,
                    plateNumber: cleanedPlateNumber,
                    branch: currentUserBranch,
                    gateType: "entrance",
                    method: "manual",
                    success: false,
                    blacklistHit: true,
                    isGuest: true,
                    notes: "Blacklisted"
                });
                io.emit("newLog", log); // Emit the new log
                return res.status(403).json({ message: "Guest vehicle is blacklisted", log });
            }

            // Case 5: Access expired
            if (guestVehicle.validUntil < new Date()) {
                const log = await Log.create({
                    vehicle: guestVehicle._id,
                    plateNumber: cleanedPlateNumber,
                    branch: currentUserBranch,
                    gateType: "entrance",
                    method: "manual",
                    success: false,
                    isGuest: true,
                    notes: "Guest access expired"
                });
                io.emit("newLog", log); // Emit the new log
                return res.status(403).json({ message: "Guest vehicle access expired", log });
            }

            // Case 6: Success
            const log = await Log.create({
                vehicle: guestVehicle._id,
                plateNumber: cleanedPlateNumber,
                branch: currentUserBranch,
                gateType: "entrance",
                method: "manual",
                success: true,
                isGuest: true,
                notes: "Verified by manual entry"
            });
            io.emit("newLog", log); // Emit the new log
            return res.status(201).json({ message: "Entry granted", log });
        }

        // Case 7: Unregistered vehicle                    
        const log = await Log.create({
            plateNumber: cleanedPlateNumber,
            branch: currentUserBranch,
            gateType: "entrance",
            method: "manual",
            success: false,
            notes: "Unregistered"
        });
        io.emit("newLog", log); // Emit the new log
        return res.status(403).json({ message: "Unregistered vehicle", log });
    } catch (error) {
        console.error("Error in entranceLogManual controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Manual exit log controller
export const exitLogManual = async (req, res) => {
    const { plateNumber } = req.body;
    const currentUserBranch = req.user.branch
    try {
        if (!plateNumber) {
            return res.status(400).json({ message: "Plate number is required" });
        }

        const cleanedPlateNumber = removeAllWhitespace(plateNumber);

        // Find the last log for this plate
        const lastLog = await Log.findOne({ plateNumber: cleanedPlateNumber })
            .sort({ timestamp: -1 });

        // If there’s no previous entrance or last log was already an exit
        if (!lastLog || lastLog.gateType === "exit") {
            return res.status(400).json({
                message: "Vehicle cannot exit without an active entrance record.",
            });
        }

        // First, check if it’s a registered vehicle
        const vehicle = await Vehicle.findOne({ plateNumber: cleanedPlateNumber }); // check if it's a registered vehicle

        if (vehicle) {
            // Case 1: Success
            const log = await Log.create({
                vehicle: vehicle._id,
                plateNumber: cleanedPlateNumber,
                branch: currentUserBranch,
                gateType: "exit",
                method: "manual",
                success: true,
                notes: "Verified by manual entry"
            });
            io.emit("newLog", log); // Emit the new log
            return res.status(201).json({ message: "Exit granted", log });
        }

        const guestVehicle = await GuestVehicle.findOne({ plateNumber: cleanedPlateNumber }); // check if it's a guest vehicle

        if (guestVehicle) {
            // Case 2: Success
            const log = await Log.create({
                vehicle: guestVehicle._id,
                plateNumber: cleanedPlateNumber,
                branch: currentUserBranch,
                gateType: "exit",
                method: "manual",
                success: true,
                isGuest: true,
                notes: "Verified by manual entry"
            });
            io.emit("newLog", log); // Emit the new log
            return res.status(201).json({ message: "Exit granted for guest vehicle", log });
        }

        // Case 3: Unrecognized Plate
        const log = await Log.create({
            plateNumber: cleanedPlateNumber,
            branch: currentUserBranch,
            gateType: "exit",
            method: "manual",
            success: false,
            notes: "Unrecognized Plate Number"
        });
        io.emit("newLog", log); // Emit the new log
        return res.status(403).json({ message: "Unrecognized Plate Number, please open the gate manually", log });
    } catch (error) {
        console.error("Error in exitLogManual controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};