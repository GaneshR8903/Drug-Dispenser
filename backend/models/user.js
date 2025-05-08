const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Ensures unique email addresses
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Invalid email format"],
      index: true, // Optional: Index to improve search performance
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Define allowed roles
      default: "user",
    },
    resetPasswordToken: String, // Token for password reset
    resetPasswordExpires: Date, // Expiry time for the reset token
    otp: String, // One-time password for reset (if used)
    otpExpires: Date, // Expiry time for OTP (if used)
    resetPasswordRequestedAt: { type: Date, default: Date.now }, // Tracks when the reset request was made
  },
  
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const User = mongoose.model("User", userSchema);
module.exports = User;
