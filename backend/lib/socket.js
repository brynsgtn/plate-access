import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";

const app = express();
const server = http.createServer(app);

// Define allowed origins based on environment
const allowedOrigins = 
  process.env.NODE_ENV === "production"
    ? ["https://plate-access.onrender.com"] // 
    : ["http://localhost:5173", "http://localhost:5174"]; // Development

//  Apply CORS to Express (for HTTP requests)
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ Blocked by CORS: ${origin}`);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true, // Allow cookies to be sent
}));

//  Configure Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Use the same allowed origins
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
    console.log("✅ A user connected", socket.id);

    // Disconnect
    socket.on("disconnect", () => {
        console.log("❌ A user disconnected", socket.id);
    });
});

export { io, app, server };