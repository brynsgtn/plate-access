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
        // Vehicle's registration approval status - for parking staff
        isApproved: {
            type: Boolean,
            default: false
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