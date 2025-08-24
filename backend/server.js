import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use("/", (req, res) => {
    console.log("Welcome to PlateAccess server!")
    res.send("Welcome to PlateAccess server!");
});

// TO DO: routes, controllers, and database connection.

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});