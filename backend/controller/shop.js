const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Shop = require("../model/shop");
const upload = require("../utils/multer");
const sendMail = require("../utils/sendMail");
const sendShopToken = require("../utils/sendShopToken");
require("dotenv").config();

// ✅ Create Shop & Send Activation Link
const createShop = async (req, res) => {
  try {
    const { shopName, email, password, zipCode, address } = req.body;
    const file = req.file;

    if (!shopName || !email || !password || !zipCode || !address || !file) {
      return res.status(400).json({
        success: false,
        message: "All fields including avatar are required",
      });
    }

    const shopExists = await Shop.findOne({ email });
    if (shopExists) {
      return res.status(400).json({
        success: false,
        message: "Shop already exists",
      });
    }

    const shopData = {
      shopName,
      email,
      password,
      zipCode,
      address,
      avatar: {
        public_id: file.filename,
        url: "", // placeholder, will be updated after activation
      },
      role: "seller",
    };

    const activationToken = jwt.sign(shopData, process.env.ACTIVATION_SECRET, {
      expiresIn: "5m",
    });

    const activationUrl = `http://localhost:5173/shop/activation/${activationToken}`;

    await sendMail({
      email,
      subject: "Activate your shop account",
      message: `Hello ${shopName},\n\nClick the link to activate your account:\n${activationUrl}`,
    });

    return res.status(200).json({
      success: true,
      message: `Activation email sent to ${email}`,
    });
  } catch (error) {
    console.error("Create Shop Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating shop",
    });
  }
};

// ✅ Activate Shop
const activateShop = async (req, res) => {
  try {
    const { activationToken } = req.body;

    if (!activationToken) {
      return res.status(400).json({
        success: false,
        message: "No activation token provided",
      });
    }

    let shopData;
    try {
      shopData = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired activation token",
      });
    }

    const existingShop = await Shop.findOne({ email: shopData.email });
    if (existingShop) {
      return res.status(200).json({
        success: true,
        message: "Shop already activated",
      });
    }

    const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${shopData.avatar.public_id}`;

    const shop = await Shop.create({
      ...shopData,
      avatar: {
        public_id: shopData.avatar.public_id,
        url: avatarUrl,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Shop account activated successfully",
      shop,
    });
  } catch (error) {
    console.error("Activation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error activating shop account",
    });
  }
};

// ✅ Login Shop
const loginShop = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const shop = await Shop.findOne({ email }).select("+password");
    if (!shop) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, shop.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    sendShopToken(shop, 200, res);
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// ✅ Get Shop Details
const getSeller = async (req, res) => {
  try {
    const shop = await Shop.findById(req.user.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${shop.avatar.public_id}`;

    return res.status(200).json({
      success: true,
      shop: {
        ...shop._doc,
        avatar: {
          public_id: shop.avatar.public_id,
          url: avatarUrl,
        },
      },
    });
  } catch (error) {
    console.error("Get Seller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch shop details",
    });
  }
};

// ✅ Logout Shop
const logoutShop = async (req, res) => {
  try {
    res.cookie("seller_token", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

// ✅ Route Bindings
router.post("/create-shop", upload.single("file"), createShop);
router.post("/activation", activateShop);
router.post("/login-shop", loginShop);
router.get("/getSeller", getSeller);
router.get("/logout", logoutShop);

module.exports = router;
