// Import dependencies
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


// Import route modules
import authRoutes from "../backend/routes/auth.route.js";
import userRoutes from "../backend/routes/user.route.js"
import vehicleRoutes from "./routes/vehicle.route.js"
import logRoutes from "./routes/log.route.js"
import guestVehicleRoutes from "./routes/guestVehicle.route.js"

// Import socket
import { app, server } from "./lib/socket.js"

// Import library functions
import { connectDB } from "./lib/db.js";

// Load environment variables from .env
dotenv.config();

// Define server port
const PORT = process.env.PORT || 5001;

// Middleware that allows to parse the body of request
app.use(express.json());
// Middleware to parse cookies from the incoming request
app.use(cookieParser());

// Routes for authentication
app.use("/api/auth", authRoutes);

// Routes for user management (admin-only)
app.use("/api/user", userRoutes);

// Routes for vehicle  
app.use("/api/vehicle", vehicleRoutes);

// Routes for guest vehicle  
app.use("/api/guest-vehicle", guestVehicleRoutes);

// Routes for vehicle logs
app.use("/api/log", logRoutes);

// Start server and listen on defined port
server.listen(PORT,  () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB(); // connects to mongoDB
});
