const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    gamerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },

    collegeEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    campus: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    platform: {
      type: String,
      enum: ["PC", "Mobile", "Both", ""],
      default: "",
    },

    games: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);