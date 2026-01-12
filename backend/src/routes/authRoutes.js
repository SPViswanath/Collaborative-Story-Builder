const express  =require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");


const {signup,Login, googleLogin, getMe} = require("../controllers/authController.js");

router.post("/signup",signup);
router.post("/login",Login);
router.post("/google",googleLogin);
router.get("/me",authMiddleware, getMe);
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path:"/"
  });

  res.status(200).json({
    message: "Logged out successfully"
  });
});

module.exports = router;