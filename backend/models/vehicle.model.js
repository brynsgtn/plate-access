// Import dependencies
import mongoose from "mongoose";

// Definition of vehicle schema
const vehicleSchema = new mongoose.Schema(
    {
        // Vehicle's plate number
        plateNumber: {
            type: String,
            required: true,
            unique: true
        },
        // Vehicle's make and model
        makeModel: {
            type: String,
            required: true
        },
        // Vehicle's owner name
        ownerName: {
            type: String,
            required: true
        },
        // Vehicle's blacklisted status
        isBlacklisted: {
            type: Boolean,
            default: false
        },
        // Date when the vehicle was blacklisted
        isBlacklistedAt: {
            type: Date,
            default: null
        },
        //Requests made my parking staff
        // Vehicle's registration approval status - for parking staff
        isApproved: {
            type: Boolean,
            default: false
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        updateRequest: {
            type: new mongoose.Schema({
                requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                requestedAt: { type: Date, default: Date.now },
                approvedOrDeclinedAt: { type: Date, default: null },
                reason: { type: String },
                status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
            }, { _id: false }),
            default: null
        },

        deleteRequest: {
            type: new mongoose.Schema({
                requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                requestedAt: { type: Date, default: Date.now },
                approvedOrDeclinedAt: { type: Date, default: null },
                reason: { type: String },
                status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
            }, { _id: false }),
            default: null
        }

    },
    {
        timestamps: true, // Created at, updated at, etc..
    }
);

// Create the Vehicle model
const Vehicle = mongoose.model("Vehicle", vehicleSchema);

// Export the Vehicle model
export default Vehicle;