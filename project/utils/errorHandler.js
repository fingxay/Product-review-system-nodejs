const logger = require("./logger");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log lỗi ra hệ thống logging
  logger.error(
    `${req.method} ${req.originalUrl} - ${statusCode} - ${message}`
  );

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
