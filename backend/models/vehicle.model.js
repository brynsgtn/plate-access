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
        // Request to update request details - for parking staff
        updateRequest: {
            type: Object,
            requestedBy: {
                type: String,
                required: true
            },
            requestedAt: {
                type: Date,
                default: Date.now
            },
            approvedOrDeclinedAt: {
                type: Date,
                default: null
            },
            reason: {
                type: String,
                required: true
            },
            status: {
                type: String,
                enum: ['pending', 'approved', 'rejected'],
                default: null
            }
        },
        // Request to delete vehicle - for parking staff
        deleteRequest: {
            type: Object,
            properties: {
                requestedBy: {
                    type: String, required: true
                },
                approvedOrDeclinedAt: {
                    type: Date,
                    default: null
                },
                reason: {
                    type: String, required: true
                },
                status: {
                    type: String,
                    enum: ['pending', 'approved', 'rejected'],
                    default: 'pending'
                }
            }
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