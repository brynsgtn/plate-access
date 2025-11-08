// Import dependencies
import mongoose from "mongoose";
import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

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


// MySQL configuration
  const  mysqlConfig = {
        host: "localhost",
        user: "root",
        password: "",
        database: "plate_access_db",
        port: 3307,
    };


// Create MySQL pool
export const pool = createPool(mysqlConfig);

// Test MySQL connection
export const connectMySQL = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("MySQL connected successfully");
        connection.release();
    } catch (err) {
        console.error("MySQL connection failed:", err.message, err.code);
        process.exit(1);
    }
};