// Load environment variables first
require("dotenv").config();

const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

// CORS config
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Middleware to parse JSON and URL encoded data
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

app.use(cookieParser());

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const couponCode = require("./controller/couponCode");

// Register routes
app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", couponCode);
module.exports = app;
