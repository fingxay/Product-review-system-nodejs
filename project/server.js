// project/server.js
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./utils/db");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routers/auth.routes");
const productRoutes = require("./routers/product.routes");
const reviewRoutes = require("./routers/review.routes");

const logger = require("./utils/logger");
const errorHandler = require("./utils/errorHandler");

const app = express();

const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === "production";

// ===== Request Logger (cái bạn hỏi) =====
// Tác dụng: log method + url + status + thời gian xử lý request
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
});

// ===== Middlewares =====
app.use(cookieParser());

// Helmet: dev thì tắt CSP để khỏi block ảnh/js khi bạn đang làm UI
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "http://localhost:3000",
          "http://127.0.0.1:5500",
          "*"
        ],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);


// Nếu bạn chạy frontend bằng chính localhost:3000 thì CORS không cần,
// nhưng giữ lại để khi bạn còn dùng Live Server (5500) vẫn chạy được.
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Static serving =====
// server.js nằm trong /project nên cần lùi 1 cấp ra root để tới /static và /templates
const ROOT_DIR = path.join(__dirname, "..");
const STATIC_DIR = path.join(ROOT_DIR, "static");
const TEMPLATES_DIR = path.join(ROOT_DIR, "templates");

// Serve /static/... (css/js/images...)
app.use("/static", express.static(STATIC_DIR));

// Serve templates theo đúng URL bạn đang fetch: /templates/share/header.html
app.use("/templates", express.static(TEMPLATES_DIR));

// Serve templates luôn ở root để mở trực tiếp: http://localhost:3000/index.html
app.use(express.static(TEMPLATES_DIR));

// ===== API Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);

// ===== Error Handler =====
app.use(errorHandler);

// ===== Connect DB =====
connectDB();

// (Optional) root API ping
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);

  // In link để bạn click mở nhanh
  logger.info(`Open UI: http://localhost:${PORT}/index.html`);
  logger.info(`Login:   http://localhost:${PORT}/login.html`);
  logger.info(`Register:http://localhost:${PORT}/register.html`);
});
