const AuthService = require("../services/auth.service");
const { verifyRefreshToken, generateAccessToken, verifyAccessToken } = require("../utils/jwt");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user.model");

const isProd = process.env.NODE_ENV === "production";

/**
 * REGISTER
 */
exports.register = catchAsync(async (req, res) => {
  const result = await AuthService.register(req.body);

  res.json({
    success: true,
    message: result.message,
  });
});

/**
 * LOGIN
 */
exports.login = catchAsync(async (req, res) => {
  const { accessToken, refreshToken, userId } =
  await AuthService.login(req.body);

// Lấy user từ DB để trả role cho frontend
const user = await User.findById(userId).select("email role");

if (!user) {
  return res.status(401).json({
    success: false,
    message: "Login failed: user not found (invalid userId from AuthService)",
  });
}

  /**
   * ===== Set HTTP-Only Cookies =====
   */
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,        // local = false, prod = true (https)
    sameSite: "lax",
    maxAge: 15 * 60 * 1000 // 15 phút
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
  });

  res.json({
    success: true,
    message: "Login success",
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
  });

});

/**
 * REFRESH ACCESS TOKEN
 */
exports.refresh = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token missing",
    });
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }

  const payload = {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  };

  const newAccessToken = generateAccessToken(payload);

  // Set lại access token cookie
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 phút
  });

  return res.json({
    success: true,
    message: "Access token refreshed",
  });
});


/**
 * GET CURRENT USER
 */
exports.me = catchAsync(async (req, res) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.json({
      loggedIn: false,
    });
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    return res.json({
      loggedIn: false,
    });
  }

  const user = await User.findById(decoded.userId).select(
    "username email role"
  );

  if (!user) {
    return res.json({
      loggedIn: false,
    });
  }

  return res.json({
    loggedIn: true,
    user,
  });
});

exports.logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ success: true });
};
