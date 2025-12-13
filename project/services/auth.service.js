const User = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/hashing");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");

class AuthService {
  static async register({ username, email, password }) {
    const exists = await User.findOne({ email });
    if (exists) throw new Error("Email already exists");

    const passwordHash = await hashPassword(password);

    const user = new User({
      username,
      email,
      passwordHash,
    });

    await user.save();

    return {
      message: "Register success",
    };
  }

  static async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) throw new Error("Wrong password");

    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }
}

module.exports = AuthService;
