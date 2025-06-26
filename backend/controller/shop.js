const express = require("express");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/sendMail");
const Shop = require("../model/shop");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const upload = require("../utils/multer");
require("dotenv").config();

const router = express.Router();

// Create Activation Token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, { expiresIn: "30m" });
};

// Send token
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

// ======================= REGISTER + AUTH =======================

router.post("/create-shop", upload.single("avatar"), async (req, res) => {
  try {
    const { email, shopName, password, address, phoneNumber, zipCode } = req.body;

    if (!email || !shopName || !password || !address || !phoneNumber || !zipCode || !req.file) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "All fields including avatar are required" });
    }

    const shopExists = await Shop.findOne({ email });
    if (shopExists) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Shop with this email already exists" });
    }

    const avatar = {
      public_id: req.file.filename,
      url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
    };

    const shop = { shopName, email, password, avatar, address, phoneNumber, zipCode };
    const activationToken = createActivationToken(shop);
    const activationUrl = `http://localhost:5173/seller/activation/${activationToken}`;

    await sendMail({
      email,
      subject: "Activate your shop",
      message: `Hello ${shopName}, please click to activate your shop: ${activationUrl}`,
    });

    res.status(201).json({
      success: true,
      message: `Check your email (${shop.email}) to activate your shop.`,
    });
  } catch (error) {
    console.error("Shop creation error:", error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: "Shop registration failed" });
  }
});

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
        message: "Shop already activated. Please login.",
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
    console.error("Activation error:", error);
    res.status(500).json({ success: false, message: "Activation failed" });
  }
});

router.post("/login-shop", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const shop = await Shop.findOne({ email }).select("+password");
    if (!shop || !shop.password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, shop.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    if (shop.avatar?.url) {
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
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({ success: true, message: "Login successful", shop, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// ======================= LOGOUT API =======================

router.get("/logout", async (req, res) => {
  res.cookie("shop_token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({ success: true, message: "Logout successful" });
});

// ======================= PROFILE =======================

router.get("/get-shop", isSeller, async (req, res) => {
  try {
    const shop = await Shop.findById(req.seller._id).select("-password");
    if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });

    res.status(200).json({ success: true, shop });
  } catch (error) {
    console.error("Get shop error:", error);
    res.status(500).json({ success: false, message: "Could not get shop" });
  }
});

router.get("/get-shop-info/:id", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    res.status(200).json({ success: true, shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/update-shop-avatar", isSeller, async (req, res) => {
  try {
    const shop = await Shop.findById(req.seller._id);
    if (!shop) return res.status(404).json({ success: false, message: "Seller not found" });

    shop.avatar = {
      public_id: `updated_${Date.now()}`,
      url: req.body.avatar,
    };

    await shop.save();

    res.status(200).json({ success: true, seller: shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/update-seller-info", isSeller, async (req, res) => {
  try {
    const { shopName, description, address, phoneNumber, zipCode } = req.body;

    const shop = await Shop.findById(req.seller._id); // ✅ Fixed bug here

    if (!shop) return res.status(404).json({ success: false, message: "Seller not found" });

    shop.shopName = shopName;
    shop.description = description;
    shop.address = address;
    shop.phoneNumber = phoneNumber;
    shop.zipCode = zipCode;

    await shop.save();

    res.status(200).json({ success: true, shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================= ADMIN =======================

router.get("/admin-all-sellers", isAuthenticated, isAdmin("Admin"), async (req, res) => {
  try {
    const sellers = await Shop.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, sellers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/delete-seller/:id", isAuthenticated, isAdmin("Admin"), async (req, res) => {
  try {
    const seller = await Shop.findById(req.params.id);
    if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

    await Shop.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Seller deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================= WITHDRAW METHODS =======================

router.put("/update-payment-methods", isSeller, async (req, res) => {
  try {
    const { withdrawMethod } = req.body;
    const seller = await Shop.findByIdAndUpdate(req.seller._id, { withdrawMethod }, { new: true });

    res.status(200).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/delete-withdraw-method", isSeller, async (req, res) => {
  try {
    const seller = await Shop.findById(req.seller._id);
    if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

    seller.withdrawMethod = null;
    await seller.save();

    res.status(200).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
