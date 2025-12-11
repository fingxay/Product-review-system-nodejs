// project/models/user.model.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true, // sẽ lưu password đã mã hoá bằng bcrypt
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, // tự tạo createdAt, updatedAt
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
