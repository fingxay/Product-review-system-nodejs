const { verifyToken } = require("../utils/jwt");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Không có token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  // Verify token
  const { valid, decoded, error } = verifyToken(token);

  if (!valid) {
    return res.status(401).json({ message: "Invalid token", error });
  }

  // Nếu token hợp lệ → gắn info user vào request
  req.user = decoded;

  next(); // cho phép đi tiếp vào controller
}

module.exports = authMiddleware;
