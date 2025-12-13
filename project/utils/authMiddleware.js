const { verifyAccessToken } = require("../utils/jwt");

function authMiddleware(req, res, next) {
  // LẤY ACCESS TOKEN TỪ COOKIE
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Access token missing.",
    });
  }

  try {
    // VERIFY ACCESS TOKEN
    const decoded = verifyAccessToken(token);

    // GẮN USER VÀO REQUEST
    req.user = decoded;

    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
}

module.exports = authMiddleware;
