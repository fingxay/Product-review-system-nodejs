const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./utils/db");

const app = express();

const authRoutes = require("./routers/auth.routes");

// middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect DB
connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});
