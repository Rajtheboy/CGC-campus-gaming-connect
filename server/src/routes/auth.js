const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ==================== SIGNUP ====================

router.post("/signup", async (req, res) => {
  try {
    const { gamerName, collegeEmail, password, campus, platform, games } =
      req.body;

    if (!gamerName || !collegeEmail || !password) {
      return res.status(400).json({
        message: "Gamer name, college email and password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    const normalizedEmail = collegeEmail.trim().toLowerCase();

    const existingUser = await User.findOne({
      collegeEmail: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      gamerName: gamerName.trim(),
      collegeEmail: normalizedEmail,
      password: hashedPassword,
      campus: campus?.trim() || "",
      platform: platform || "",
      games: Array.isArray(games) ? games : [],
    });

    return res.status(201).json({
      message: "Account created successfully.",
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
    console.error("Signup error:", error.message);

    return res.status(500).json({
      message: "Something went wrong while creating the account.",
    });
  }
});

// ==================== LOGIN ====================

router.post("/login", async (req, res) => {
  try {
    const { collegeEmail, password } = req.body;

    if (!collegeEmail || !password) {
      return res.status(400).json({
        message: "College email and password are required.",
      });
    }

    const normalizedEmail = collegeEmail.trim().toLowerCase();

    const user = await User.findOne({
      collegeEmail: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Create authentication token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
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
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Something went wrong while logging in.",
    });
  }
});

module.exports = router;