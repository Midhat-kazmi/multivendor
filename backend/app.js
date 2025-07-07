// Load environment variables first
require("dotenv").config();

const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

// CORS config
const cors = require("cors");

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);


// Middleware to parse JSON and URL encoded data
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

app.use(cookieParser());

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));


app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});
// import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/couponCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation");
const message = require("./controller/message");
const withdraw = require("./controller/withdraw");

app.use("/api/v2/user", user);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/api/v2/order", order);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/withdraw", withdraw);





module.exports = app;