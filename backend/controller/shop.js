const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/sendMail");
const Shop = require("../model/shop");
const {isSeller} = require("../middleware/auth");
const upload = require("../utils/multer");
require("dotenv").config();

// Create Activation Token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
};

// Create token and save in cookie
const sendShopToken = (shop, statusCode, res) => {
  const token = jwt.sign({ id: shop._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };

  res.status(statusCode).cookie("shop_token", token, options).json({
    success: true,
    shopName: shop.shopName,
    token,
  });
};

// Register Shop and Send Activation Email
router.post("/create-shop", upload.single("avatar"), async (req, res) => {
  try {
    const { email, shopName, password, address, phoneNumber, zipCode } = req.body;

    if (!email || !shopName || !password || !address || !phoneNumber || !zipCode || !req.file) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "All fields including avatar are required",
      });
    }

    const shopExists = await Shop.findOne({ email });
    if (shopExists) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Shop with this email already exists",
      });
    }

    const avatar = {
      public_id: req.file.filename,
      url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
    };

    const shop = {
      shopName,
      email,
      password,
      avatar,
      address,
      phoneNumber,
      zipCode,
    };

    const activationToken = createActivationToken(shop);
    const activationUrl = `http://localhost:5173/seller/activation/${activationToken}`;

    await sendMail({
      email: email,
      subject: "Activate your shop",
      message: `Hello ${shopName}, please click the link to activate your shop: ${activationUrl}`,
    });

    res.status(201).json({
      success: true,
      message: `Please check your email: ${shop.email} to activate your shop.`,
    });
  } catch (error) {
    console.error("Shop creation failed:", error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Something went wrong during shop registration.",
    });
  }
});

// Activate Shop
router.post("/activation", async (req, res) => {
  try {
    const { activation_token } = req.body;

    if (!activation_token) {
      return res.status(400).json({ success: false, message: "No activation token provided" });
    }

    const newShop = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    const { shopName, email, password, avatar, address, phoneNumber, zipCode } = newShop;

    const shopExists = await Shop.findOne({ email });
    if (shopExists) {
      return res.status(200).json({
        success: true,
        message: "Shop already activated. Please log in.",
        shop: shopExists,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const shop = await Shop.create({
      shopName,
      email,
      password: hashedPassword,
      avatar,
      address,
      phoneNumber,
      zipCode,
    });

    sendShopToken(shop, 201, res);
  } catch (error) {
    console.error("Activation failed:", error);
    res.status(500).json({ success: false, message: "Activation failed" });
  }
});

// ✅ Updated Login Shop API
router.post("/login-shop", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const shop = await Shop.findOne({ email }).select("+password");
    if (!shop || !shop.password) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, shop.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Normalize avatar URL
    if (shop.avatar && shop.avatar.url) {
      const filename = path.basename(shop.avatar.url.replace(/\\/g, "/"));
      shop.avatar = {
        public_id: filename,
        url: `${req.protocol}://${req.get("host")}/uploads/${filename}`,
      };
    }

    const token = jwt.sign({ id: shop._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    res.cookie("shop_token", token, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      shop,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
});

// Get shop profile
router.get("/get-shop", isSeller, async (req, res) => {
  try {
    const shop = await Shop.findById(req.seller._id).select("-password");
    if (!shop)
      return res.status(404).json({ success: false, message: "Shop not found" });
    res.status(200).json({ success: true, shop });
  } catch (error) {
    console.error("Fetching shop failed:", error);
    res.status(500).json({ success: false, message: "Error fetching shop details" });
  }
});

// get shop info
router.get(
  "/get-shop-info/:id",
  (async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(error.message, 500);
    }
  })
);

module.exports = router;
