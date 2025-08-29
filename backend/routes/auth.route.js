import express from "express";

const router = express.Router();


router.get("/login", (req, res) => {
    res.send("Login user");
});

router.get("/logout", (req, res) => {
    res.send("Logout user");
});

export default router;