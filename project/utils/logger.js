const winston = require("winston");
const path = require("path");

// Log levels (cấp độ log)
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Màu sắc cho console
const logColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(logColors);

// Format log: thời gian + level + message
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

// Console format (có màu)
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  logFormat
);

const isProd = process.env.NODE_ENV === "production";

// Transports (nơi ghi log)
const transports = [];

transports.push(
  new winston.transports.Console({
    format: consoleFormat,
  })
);

// Nếu production thì ghi thêm ra file
if (isProd) {
  transports.push(
    new winston.transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
      format: logFormat,
    })
  );

  transports.push(
    new winston.transports.File({
      filename: path.join("logs", "combined.log"),
      format: logFormat,
    })
  );
}

// Tạo logger
const logger = winston.createLogger({
  levels: logLevels,
  level: isProd ? "info" : "debug",
  transports,
});

module.exports = logger;
