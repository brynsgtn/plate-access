import GuestVehicle from "../models/guestVehicle.model.js";
import Vehicle from "../models/vehicle.model.js";

// View guest vehicle controller
export const viewGuestVehicles = async (req, res) => {
    try {
        const guestVehicles = await GuestVehicle.find().populate("addedBy");
        res.json(guestVehicles);
    } catch (error) {
        console.error("Error in viewGuestVehicles controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Add guest vehicle controller
export const addGuestVehicle = async (req, res) => {
    const { plateNumber, makeModel, ownerName } = req.body;
    const userId = req.userId
    console.log("Add guest vehicle user id:", userId)

    try {
        if (!plateNumber || !makeModel || !ownerName) {
            return res.status(400).json({ message: "All fields are required" });
        };

        const registeredVehicleExists = await Vehicle.findOne({ plateNumber });
        if (registeredVehicleExists) {
            return res.status(400).json({ message: "Vehicle already registered" });
        };

        const guestVehicleExists = await GuestVehicle.findOne({ plateNumber });
        if (guestVehicleExists) {
            return res.status(400).json({ message: "Guest vehicle already exists" });
        };

        const newGuestVehicle = new GuestVehicle({
            plateNumber,
            makeModel,
            ownerName,
            addedBy: userId,
            validFrom: Date.now(),
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
        });

        await newGuestVehicle.save();

        res.status(200).json({
            message: "Guest vehicle authorized for 1 day",
            guestVehicle: newGuestVehicle
        });

    } catch (error) {
        console.error("Error in addGuestVehicle controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Extend guest vehicle controller
export const extendGuestVehicle = async (req, res) => {
    const { plateNumber } = req.body;

    try {
        const guestVehicle = await GuestVehicle.findOne({ plateNumber });

        if (!plateNumber) {
            return res.status(400).json({ message: "Plate number is required" });
        }

        if (!guestVehicle) {
            return res.status(404).json({ message: "Guest vehicle not found" });
        }

        // Only allow extension if expired
        if (guestVehicle.validUntil > Date.now()) {
            return res.status(400).json({ message: "Guest vehicle is not expired" });
        }

        // Extend for another day
        guestVehicle.validUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
        await guestVehicle.save();

        res.status(200).json({
            message: "Guest vehicle extended for 1 day",
            guestVehicle
        });

    } catch (error) {
        console.error("Error in extendGuestVehicle controller:", error);
        res.status(500).json({ message: "Server error" });
    }
} 

// Delete guest vehicle controller
export const deleteGuestVehicle = async (req, res) => {
    const { plateNumber } = req.body;

    try {
        if (!plateNumber) {
            return res.status(400).json({ message: "Plate number is required" });
        }

        const guestVehicle = await GuestVehicle.findOneAndDelete({ plateNumber });

        if (!guestVehicle) {
            return res.status(404).json({ message: "Guest vehicle not found" });
        }

        res.status(200).json({ message: "Guest vehicle deleted", guestVehicle });

    } catch (error) {
        console.error("Error in deleteGuestVehicle controller:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Blacklist guest vehicle controller
export const blacklistOrUnblacklistGuestVehicle = async (req, res) => {
    const { plateNumber } = req.body;

    try {
        if (!plateNumber) {
            return res.status(400).json({ message: "Plate number is required" });
        }

        const guestVehicle = await GuestVehicle.findOne({ plateNumber });

        if (!guestVehicle) {
            return res.status(404).json({ message: "Guest vehicle not found" });
        }

        if(guestVehicle.isBlacklisted) {
            guestVehicle.isBlacklisted = false;
            guestVehicle.isBlacklistedAt = null;
            await guestVehicle.save();
            return res.status(200).json({ message: "Guest vehicle unblacklisted", guestVehicle });
        }
        
        guestVehicle.isBlacklisted = true;
        guestVehicle.isBlacklistedAt = Date.now();
        await guestVehicle.save();

        res.status(200).json({ message: "Guest vehicle blacklisted", guestVehicle });

    } catch (error) {
        console.error("Error in blacklistGuestVehicle controller:", error);
        res.status(500).json({ message: "Server error" });
    }
}