const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");


const {signup,Login, googleLogin, getMe, refreshToken, logout} = require("../controllers/authController.js");

router.post("/signup",signup);
router.post("/login",Login);
router.post("/google",googleLogin);
router.get("/me",authMiddleware, getMe);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

module.exports = router;