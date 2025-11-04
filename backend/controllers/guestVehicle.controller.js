import GuestVehicle from "../models/guestVehicle.model.js";
import Vehicle from "../models/vehicle.model.js";

// View guest vehicle controller
export const viewGuestVehicles = async (req, res) => {
    try {
        const guestVehicles = await GuestVehicle.find()
            .populate("addedBy", "-password")
            .populate("blacklistedBy", "username email")
            .populate("unblacklistedBy", "username email");
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

        // Check if registered vehicle 
        const registeredVehicleExists = await Vehicle.findOne({ plateNumber: cleanedPlateNumber });
        if (registeredVehicleExists) {
            return res.status(400).json({ message: "Vehicle already registered" });
        };

        // Prevent duplicates in guest vehicles
        const guestVehicleExists = await GuestVehicle.findOne({ plateNumber: cleanedPlateNumber });
        if (guestVehicleExists) {
            // Check if max 3-month period exceeded
            const maxAllowedDate = new Date(guestVehicleExists.validFrom);
            maxAllowedDate.setMonth(maxAllowedDate.getMonth() + 3);

            if (Date.now() > maxAllowedDate) {
                await GuestVehicle.findByIdAndDelete(guestVehicleExists._id);
            } else {
                return res.status(400).json({ message: "Guest vehicle already exists" });
            }
        }

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

        // Check 3-month max rule
        const maxAllowedDate = new Date(guestVehicle.validFrom);
        maxAllowedDate.setMonth(maxAllowedDate.getMonth() + 3);
        if (Date.now() > maxAllowedDate) {
            await GuestVehicle.findByIdAndDelete(guestVehicle._id);
            return res.status(400).json({
                message: "Guest vehicle has reached maximum 3-month duration and has been removed. Please reapply for guest access."
            });
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

// Archive/unarchive guest vehicle controller
export const archiveUnarchiveGuestVehicle = async (req, res) => {
    const { id } = req.body;

    try {
        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }

        const guestVehicle = await GuestVehicle.findOne({ _id: id });

        if (!guestVehicle) {
            return res.status(404).json({ message: "Guest vehicle not found" });
        }

        guestVehicle.isArchived = !guestVehicle.isArchived;
        await guestVehicle.save();

        res.status(200).json({
            message: `Guest vehicle ${guestVehicle.isArchived ? "archived" : "unarchived"} successfully`,
            guestVehicle
        });

    } catch (error) {
        console.error("Error in archiveUnarchiveGuestVehicle controller:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Blacklist guest vehicle controller
export const blacklistOrUnblacklistGuestVehicle = async (req, res) => {
    const { id, reason } = req.body;
    const reqUser = req.user;

    try {
        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }

        if (!reason) {
            return res.status(400).json({ message: "Reason is required" });
        }

        const guestVehicle = await GuestVehicle.findOne({ _id: id });

        if (!guestVehicle) {
            return res.status(404).json({ message: "Guest vehicle not found" });
        }

        if (guestVehicle.isBlacklisted) {
            guestVehicle.isBlacklisted = false;
            guestVehicle.isBlacklistedAt = null;
            guestVehicle.unblacklistReason = reason;
            guestVehicle.unblacklistedAt = Date.now();
            guestVehicle.unblacklistedBy = reqUser._id;
            guestVehicle.validUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // extend for 1 day upon unblacklisting   
            await guestVehicle.save();
            return res.status(200).json({ message: "Guest vehicle unblacklisted", guestVehicle });
        }


        // Check 3-month max rule
        const maxAllowedDate = new Date(guestVehicle.validFrom);
        maxAllowedDate.setMonth(maxAllowedDate.getMonth() + 3);
        if (Date.now() > maxAllowedDate) {
            await GuestVehicle.findByIdAndDelete(guestVehicle._id);
            return res.status(400).json({
                message: "Guest vehicle has reached maximum 3-month duration and has been removed. Please reapply."
            });
        }


        guestVehicle.isBlacklisted = true;
        guestVehicle.isBlacklistedAt = Date.now();
        guestVehicle.validUntil = new Date(Date.now() - 1000); // 1 second before now
        guestVehicle.blackListReason = reason;
        guestVehicle.blacklistedBy = reqUser._id;
        guestVehicle.unblacklistReason = null;
        guestVehicle.unblacklistedAt = null;
        guestVehicle.unblacklistedBy = null;
        await guestVehicle.save();

        res.status(200).json({ message: "Guest vehicle blacklisted", guestVehicle });

    } catch (error) {
        console.error("Error in blacklistGuestVehicle controller:", error);
        res.status(500).json({ message: "Server error" });
    }
}