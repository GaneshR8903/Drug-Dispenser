const express = require("express");
const { signupUser, loginUser } = require("../controllers/authController");

const router = express.Router();

const blacklist = new Set(); // Temporary blacklist (Use Redis in production)

// Signup Route
router.post("/signup", signupUser);

// Login Route
router.post("/login", loginUser);

// Logout Route
router.post("/logout", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "No token provided" });
    }

    blacklist.add(token); // Add token to blacklist
    res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
