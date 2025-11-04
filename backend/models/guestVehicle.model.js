import mongoose from "mongoose";

const guestVehicleSchema = new mongoose.Schema(
    {
        plateNumber: {
            type: String,
            required: true,
        },
        makeModel: {
            type: String,
            required: true,
        },
        ownerName: {
            type: String,
            required: true,
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // the staff/admin who authorized
            required: true,
        },
        validFrom: { // can remove this
            type: Date,
            required: true,
            default: Date.now, // can start immediately
        },
        validUntil: {
            type: Date,
            required: true, // e.g., valid for 1 day
        },
        notes: {
            type: String,
            default: "",
        },
        isBlacklisted: {
            type: Boolean,
            default: false,
        },
        isBlacklistedAt: {
            type: Date,
            default: null,
        },
        blackListReason: {
            type: String,
            default: null,
        },
        blacklistedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        unblacklistedAt: {
            type: Date,
            default: null,
        },
        unblacklistReason: {
            type: String,
            default: null,
        },
        unblacklistedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
        isBanned: {
            type: Boolean,
            default: false
        },
        bannedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        bannedReason: {
            type: String,
            default: null
        },
        bannedAt: {
            type: Date,
            default: null
        },
    },
    {
        timestamps: true
    }
);

const GuestVehicle = mongoose.model("GuestVehicle", guestVehicleSchema);

export default GuestVehicle;
