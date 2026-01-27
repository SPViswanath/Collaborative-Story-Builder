const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.updateProfile = async (req, res) => {
  try {
    // ✅ YOU USE cookie auth middleware → req.userId
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized (no userId)" });
    }

    const { name, password } = req.body;

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ update name
    if (typeof name === "string" && name.trim()) {
      user.name = name.trim();
    }

    // ✅ update password only if provided
    if (typeof password === "string" && password.trim()) {
      if (password.trim().length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password.trim(), salt);
    }

    await user.save();

    // ✅ return updated safe user
    const updatedUser = await User.findById(userId).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.log("updateProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
