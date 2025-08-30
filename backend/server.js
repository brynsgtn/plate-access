// Import dependencies
import express from "express";
import dotenv from "dotenv";


// Import route modules
import authRoutes from "../backend/routes/auth.route.js";
import userRoutes from "../backend/routes/user.route.js"
import vehicleRoutes from "./routes/vehicle.route.js"
import logRoutes from "./routes/log.route.js"

// Import library functions
import { connectDB } from "./lib/db.js";

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app = express();

// Define server port
const PORT = process.env.PORT || 5001;

// TODO: Set up models and database connection.

// Routes for authentication
app.use("/api/auth", authRoutes);

// Routes for user management (admin-only)
app.use("/api/user", userRoutes);

// Routes for vehicle information - admin(read and write), staff(read-only)
app.use("/api/vehicle", vehicleRoutes);

// Routes for vehicle logs - admin(read only), staff(read and write)
app.use("/api/log", logRoutes);

// Start server and listen on defined port
app.listen(PORT,  () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB(); // connects to mongoDB
});