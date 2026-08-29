const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const testRoutes = require("./routes/test");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== SECURITY ====================

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json({ limit: "10kb" }));

// ==================== RATE LIMITING ====================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts. Please try again later.",
  },
});

// ==================== DATABASE ====================

connectDB();

// ==================== ROUTES ====================

app.use("/api/auth", authLimiter, authRoutes);

app.use("/api/test", testRoutes);

// ==================== HEALTH CHECK ====================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CGC backend is running",
  });
});

// ==================== GLOBAL ERROR HANDLER ====================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);

  res.status(500).json({
    message: "Something went wrong.",
  });
});

// ==================== SERVER ====================

app.listen(PORT, () => {
  console.log(`CGC server running on http://localhost:${PORT}`);
});