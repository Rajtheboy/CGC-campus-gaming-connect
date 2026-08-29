const express = require("express");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/protected", requireAuth, (req, res) => {
  res.status(200).json({
    message: "You reached a protected CGC route.",
    userId: req.userId,
  });
});

module.exports = router;