require("dotenv").config();
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, error: err };
  }
}

module.exports = { generateToken, verifyToken };
