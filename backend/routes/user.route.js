import express from "express";

const router = express.Router();

router.get("/register", (req, res) => {
    res.send("Register user");
});

router.get("/update", (req, res) => {
    res.send("Update user");
});

router.get("/delete", (req, res) => {
    res.send("Delete user");
});

export default router;