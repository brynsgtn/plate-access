import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: false // in case the plate is not registered
  },
  plateNumber: {
    type: String,
    required: true // always log the attempted plate, even if not in DB
  },
  gateType: {
    type: String,
    enum: ["entrance", "exit"],
    required: true
  },
  method: {
    type: String,
    enum: ["LPR", "manual"],
    required: true
  },
  success: {
    type: Boolean,
    required: true
  },
  notes: {
    type: String,
    default: ""
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Log = mongoose.model("Log", logSchema);
export default Log;
