import GuestVehicle from "../models/guestVehicle.model.js";
import Vehicle from "../models/vehicle.model.js";

// View guest vehicle controller
export const viewGuestVehicles = async (req, res) => {
    try {
        const guestVehicles = await GuestVehicle.find().populate("addedBy", "-password");
        res.json(guestVehicles);
    } catch (error) {
        console.error("Error in viewGuestVehicles controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

function removeAllWhitespace(plateNumber) {
    return plateNumber.replace(/\s+/g, "").toUpperCase();
}


// Add guest vehicle controller
export const addGuestVehicle = async (req, res) => {
    const { plateNumber, makeModel, ownerName } = req.body;
    const userId = req.userId
    console.log("Add guest vehicle user id:", userId)

    try {
        if (!plateNumber || !makeModel || !ownerName) {
            return res.status(400).json({ message: "All fields are required" });
        };
        const cleanedPlateNumber = removeAllWhitespace(plateNumber);

        const registeredVehicleExists = await Vehicle.findOne({ plateNumber: cleanedPlateNumber });
        if (registeredVehicleExists) {
            return res.status(400).json({ message: "Vehicle already registered" });
        };

        const guestVehicleExists = await GuestVehicle.findOne({ plateNumber });
        if (guestVehicleExists) {
            return res.status(400).json({ message: "Guest vehicle already exists" });
        };

        const newGuestVehicle = new GuestVehicle({
            plateNumber: cleanedPlateNumber,
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
    const { id } = req.body;

    try {

        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }

        const guestVehicle = await GuestVehicle.findOne({ _id: id });

        if (!guestVehicle) {
            return res.status(404).json({ message: "Guest vehicle not found" });
        }

        // Only allow extension if expired
        if (guestVehicle.validUntil > Date.now()) {
            return res.status(400).json({ message: "Guest vehicle is not expired" });
        }

        if (guestVehicle.isBlacklisted) {
            return res.status(400).json({ message: "Guest vehicle is blacklisted" });
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
    const { id } = req.body;

    try {
        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }

        const guestVehicle = await GuestVehicle.findOneAndDelete({ _id: id });

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
    const { id } = req.body;

    try {
        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }

        const guestVehicle = await GuestVehicle.findOne({ _id: id });

        if (!guestVehicle) {
            return res.status(404).json({ message: "Guest vehicle not found" });
        }

        if (guestVehicle.isBlacklisted) {
            guestVehicle.isBlacklisted = false;
            guestVehicle.isBlacklistedAt = null;
            await guestVehicle.save();
            return res.status(200).json({ message: "Guest vehicle unblacklisted", guestVehicle });
        }

        guestVehicle.isBlacklisted = true;
        guestVehicle.isBlacklistedAt = Date.now();
        guestVehicle.validUntil = new Date(Date.now() - 1000); // 1 second before now
        await guestVehicle.save();

        res.status(200).json({ message: "Guest vehicle blacklisted", guestVehicle });

    } catch (error) {
        console.error("Error in blacklistGuestVehicle controller:", error);
        res.status(500).json({ message: "Server error" });
    }
}