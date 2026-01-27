const express = require("express");
const router = express.Router();
const { updateProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ your JWT cookie middleware

router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
