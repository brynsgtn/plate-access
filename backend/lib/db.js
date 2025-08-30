// Import dependencies
import mongoose from "mongoose";

// Function that connects the application to database
export const connectDB = async () => {  
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.name}`);
    } catch (error) {
        console.log("Error connecting to MONGODB", error.message);
        process.exit(1);
    }  
};