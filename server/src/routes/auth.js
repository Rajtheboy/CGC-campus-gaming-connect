const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// ==================== SIGNUP ====================

router.post("/signup", async (req, res) => {
  try {
    const { gamerName, collegeEmail, password, campus, platform, games } =
      req.body;

    // Validate required fields
    if (!gamerName || !collegeEmail || !password) {
      return res.status(400).json({
        message: "Gamer name, college email and password are required.",
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    // Normalize email
    const normalizedEmail = collegeEmail.trim().toLowerCase();

    // Check for duplicate account
    const existingUser = await User.findOne({
      collegeEmail: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      gamerName: gamerName.trim(),
      collegeEmail: normalizedEmail,
      password: hashedPassword,
      campus: campus?.trim() || "",
      platform: platform || "",
      games: Array.isArray(games) ? games : [],
    });

    // Never return password
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

    // Validate required fields
    if (!collegeEmail || !password) {
      return res.status(400).json({
        message: "College email and password are required.",
      });
    }

    // Normalize email
    const normalizedEmail = collegeEmail.trim().toLowerCase();

    // Find user and explicitly include password hash
    const user = await User.findOne({
      collegeEmail: normalizedEmail,
    }).select("+password");

    // Don't reveal whether the email exists
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Compare entered password with stored bcrypt hash
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Never return password
    return res.status(200).json({
      message: "Login successful.",
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