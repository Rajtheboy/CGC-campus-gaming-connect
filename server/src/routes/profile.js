const express = require("express");
const User = require("../models/User");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// ==================== GET PROFILE ====================

router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        gamerName: user.gamerName,
        collegeEmail: user.collegeEmail,
        campus: user.campus,
        platform: user.platform,
        games: user.games,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    return res.status(500).json({
      message: "Something went wrong while loading your profile.",
    });
  }
});

module.exports = router;