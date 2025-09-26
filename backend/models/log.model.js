import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle', // references Vehicle collection
        required: true
    },
    gateType: {
        type: String,
        enum: ['entrance', 'exit'],
        required: true
    },
    action: {
        type: String,
        enum: ['open', 'close', 'attempt', 'fail'],
        required: true
    },
    success: {
        type: Boolean,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    method: {
        type: String,
        enum: ['manual', 'LPR', 'emergency'],
        required: true
    },
    user: {
        type: String, // optional admin or staff name/id
        default: null
    },
    notes: {
        type: String,
        default: ''
    }
});

 const Log = mongoose.model('Log', LogSchema);

 export default Log;