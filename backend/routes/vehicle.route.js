import express from "express";

const router = express.Router();


router.get("/", (req, res) => {
    res.send("Vehicle route");
});


export default router;