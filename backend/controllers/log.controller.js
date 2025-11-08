import Vehicle from "../models/vehicle.model.js";
import GuestVehicle from "../models/guestVehicle.model.js";
import Log from "../models/log.model.js";
import { pool } from "../lib/db.js";
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
                message: "Vehicle has no recent exit log. Please use manual entry."
            });
        }

        // Registered vehicle
        const vehicle = await Vehicle.findOne({ plateNumber: cleanedPlateNumber });
        if (vehicle) {

            if (vehicle.isBanned) {
                const log = await Log.create({
                    vehicle: vehicle._id,
                    plateNumber: cleanedPlateNumber,
                    branch: branch,
                    gateType: "entrance",
                    method: "LPR",
                    confidence: confidence,
                    success: false,
                    banHit: true,
                    notes: "Banned registered vehicle"
                });
                io.emit("newLog", log);
                return res.status(403).json({ message: "Vehicle is banned", log });
            }

            if (vehicle.isArchived) {
                const log = await Log.create({
                    vehicle: vehicle._id,
                    plateNumber: cleanedPlateNumber,
                    branch: branch,
                    gateType: "entrance",
                    method: "LPR",
                    confidence: confidence,
                    success: false,
                    archiveHit: true,
                    notes: "Archived registered vehicle"
                });
                io.emit("newLog", log);
                return res.status(403).json({ message: "Vehicle is archived, please contact admin", log });
            }

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

            if (guestVehicle.isBanned) {
                const log = await Log.create({
                    vehicle: guestVehicle._id,
                    plateNumber: cleanedPlateNumber,
                    branch: branch,
                    gateType: "entrance",
                    method: "LPR",
                    confidence: confidence,
                    success: false,
                    banHit: true, isGuest: true,
                    notes: "Banned guest vehicle"
                });
                io.emit("newLog", log);
                return res.status(403).json({ message: "Vehicle is banned", log });
            }

            if (guestVehicle.isArchived) {
                const log = await Log.create({
                    vehicle: guestVehicle._id,
                    plateNumber: cleanedPlateNumber,
                    branch: branch,
                    gateType: "entrance",
                    method: "LPR",
                    confidence: confidence,
                    success: false,
                    isGuest: true,
                    notes: "Archived guest vehicle"
                });
                io.emit("newLog", log);
                return res.status(403).json({ message: "Guest vehicle is archived, please contact admin", log });
            }
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
                message: "Vehicle has no recent entry log. Please use manual exit.",
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
    const { plateNumber, notes } = req.body;
    const currentUserBranch = req.user.branch;

    try {
        if (!plateNumber) {
            return res.status(400).json({ message: "Plate number is required" });
        }

        if (!notes) {
            return res.status(400).json({ message: "Notes are required" });
        }

        const cleanedPlateNumber = removeAllWhitespace(plateNumber);

        // Find the last log for this plate
        // const lastLog = await Log.findOne({ plateNumber: cleanedPlateNumber })
        //     .sort({ timestamp: -1 });

        // // If the last log exists and was an entrance (no exit yet)
        // if (lastLog && lastLog.gateType === "entrance" && lastLog.success) {
        //     return res.status(400).json({
        //         message: "Vehicle has not exited yet. Cannot enter again.",
        //     });
        // }

        // First, check if it’s a registered vehicle
        const vehicle = await Vehicle.findOne({ plateNumber: cleanedPlateNumber });

        if (vehicle) {

            if (vehicle.isBanned) {
                const log = await Log.create({
                    vehicle: vehicle._id,
                    plateNumber: cleanedPlateNumber,
                    branch: currentUserBranch,
                    gateType: "entrance",
                    method: "manual",
                    success: false,
                    banHit: true,
                    notes: "Banned"
                });
                io.emit("newLog", log); // Emit the new log
                return res.status(403).json({ message: "Vehicle is banned", log });
            }

            if (vehicle.isArchived) {
                const log = await Log.create({
                    vehicle: vehicle._id,
                    plateNumber: cleanedPlateNumber,
                    branch: currentUserBranch,
                    gateType: "entrance",
                    method: "manual",
                    success: false,
                    archiveHit: true,
                    notes: "Archived"
                });
                io.emit("newLog", log); // Emit the new log
                return res.status(403).json({ message: "Vehicle is archived, please contact admin", log });
            }
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
                notes: notes
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
                notes: notes
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
    const { plateNumber, notes } = req.body;
    const currentUserBranch = req.user.branch
    try {
        if (!plateNumber) {
            return res.status(400).json({ message: "Plate number is required" });
        }

        if (!notes) {
            return res.status(400).json({ message: "Notes are required" });
        }

        const cleanedPlateNumber = removeAllWhitespace(plateNumber);

        // Find the last log for this plate
        const lastLog = await Log.findOne({ plateNumber: cleanedPlateNumber })
            .sort({ timestamp: -1 });

        // If there’s no previous entrance or last log was already an exit
        // if (!lastLog || lastLog.gateType === "exit") {
        //     return res.status(400).json({
        //         message: "Vehicle cannot exit without an active entrance record.",
        //     });
        // }

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
                notes: notes
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
                notes: notes
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


export const archiveOldLogs = async (req, res) => {
    try {
        if (req.user.role !== "itAdmin") {
            return res.status(403).json({
                message: "Access denied. Only IT admins can archive old logs"
            });
        }

        const dbName = "plate_access_db";

        // Create DB if not exists and switch to it
        await pool.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        await pool.query(`USE ${dbName}`);

        // Create table if not exists
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS archived_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                vehicle_id VARCHAR(255) NULL,
                plate_number VARCHAR(255) NOT NULL,
                branch ENUM('Main Branch','North Branch','South Branch') NOT NULL,
                gate_type ENUM('entrance','exit') NOT NULL,
                method ENUM('LPR','manual') NOT NULL,
                confidence INT DEFAULT 100,
                success BOOLEAN NOT NULL,
                is_guest BOOLEAN DEFAULT FALSE,
                blacklist_hit BOOLEAN DEFAULT FALSE,
                ban_hit BOOLEAN DEFAULT FALSE,
                archive_hit BOOLEAN DEFAULT FALSE,
                notes TEXT DEFAULT '',
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_vehicle_id (vehicle_id),
                INDEX idx_plate_number (plate_number),
                INDEX idx_timestamp (timestamp)
            )
        `;
        await pool.query(createTableQuery);

        // Calculate date one year ago
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        // Get old logs
        const oldLogs = await Log.find({ timestamp: { $lt: oneYearAgo } }).lean();
        if (oldLogs.length === 0) {
            return res.status(200).json({ message: "No logs older than one year found" });
        }

        // Prepare insert query
        const insertQuery = `
            INSERT INTO archived_logs 
            (vehicle_id, plate_number, branch, gate_type, method, confidence, success, is_guest, blacklist_hit, ban_hit, archive_hit, notes, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Start transaction
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            for (const log of oldLogs) {
                await conn.query(insertQuery, [
                    log.vehicle ? String(log.vehicle) : null,
                    log.plateNumber,
                    log.branch,
                    log.gateType,
                    log.method,
                    log.confidence,
                    log.success,
                    log.isGuest,
                    log.blacklistHit,
                    log.banHit,
                    log.archiveHit,
                    log.notes || "",
                    log.timestamp
                ]);
            }

            // Delete logs only after successful archive
            await Log.deleteMany({ _id: { $in: oldLogs.map(l => l._id) } });

            await conn.commit();
            conn.release();

            res.status(200).json({
                message: `Archived and deleted ${oldLogs.length} logs older than one year`
            });

        } catch (err) {
            await conn.rollback();
            conn.release();
            throw err;
        }

    } catch (error) {
        console.error("Error archiving logs", error);
        res.status(500).json({ message: "Server error while archiving logs" });
    }
};


export const getArchivedLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const dbName = "plate_access_db";

    // Create database if missing
    await pool.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await pool.query(`USE ${dbName}`);

    // Create table if missing
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS archived_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vehicle_id VARCHAR(255) NULL,
        plate_number VARCHAR(255) NOT NULL,
        branch ENUM('Main Branch','North Branch','South Branch') NOT NULL,
        gate_type ENUM('entrance','exit') NOT NULL,
        method ENUM('LPR','manual') NOT NULL,
        confidence INT DEFAULT 100,
        success BOOLEAN NOT NULL,
        is_guest BOOLEAN DEFAULT FALSE,
        blacklist_hit BOOLEAN DEFAULT FALSE,
        ban_hit BOOLEAN DEFAULT FALSE,
        archive_hit BOOLEAN DEFAULT FALSE,
        notes TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_vehicle_id (vehicle_id),
        INDEX idx_plate_number (plate_number),
        INDEX idx_timestamp (timestamp)
      )
    `;
    await pool.query(createTableQuery);

    // Get logs
    const [archiveLogs] = await pool.query(
      `SELECT * FROM archived_logs ORDER BY timestamp DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    res.status(200).json(
      { archiveLogs }
    );

  } catch (error) {
    console.error("Error reading archived logs", error);
    res.status(500).json({
      message: "Server error while reading archived logs"
    });
  }
};


