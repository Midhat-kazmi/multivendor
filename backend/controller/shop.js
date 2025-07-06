const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Shop = require("../model/shop");
const sendMail = require("../utils/sendMail");
const upload = require("../utils/multer");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
require("dotenv").config();

// Create Activation Token
const createActivationToken = (shop) => {
  return jwt.sign(shop, process.env.ACTIVATION_SECRET, { expiresIn: "30m" });
};

// Send token and set cookie
const sendShopToken = (shop, statusCode, res) => {
  const token = shop.getJwtToken();

  res.status(statusCode)
    .cookie("shop_token", token, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .json({ success: true, shopName: shop.shopName, token });
};

// ======================= CREATE SHOP =======================

router.post("/create-shop", upload.single("avatar"), async (req, res) => {
  try {
    const { email, shopName, password, address, phoneNumber, zipCode } = req.body;

    if (!email || !shopName || !password || !address || !phoneNumber || !zipCode || !req.file) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "All fields including avatar are required" });
    }

    const existingShop = await Shop.findOne({ email });
    if (existingShop) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Shop with this email already exists" });
    }

    // Upload avatar to Cloudinary
    const myCloud = await cloudinary.uploader.upload(req.file.path, {
      folder: "shopAvatars",
    });

    const avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    const shop = { shopName, email, password, avatar, address, phoneNumber, zipCode };
    const activationToken = createActivationToken(shop);
    const activationUrl = `http://localhost:5173/seller/activation/${activationToken}`;

    await sendMail({
      email,
      subject: "Activate your shop",
      message: `Hello ${shopName}, please click here to activate your shop: ${activationUrl}`,
    });

    res.status(201).json({
      success: true,
      message: `Check your email (${email}) to activate your shop.`,
    });
  } catch (error) {
    console.error("Create Shop Error:", error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: "Shop registration failed" });
  }
});

// ======================= ACTIVATE SHOP =======================

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
      return res.status(200).json({ success: true, message: "Shop already activated. Please login.", shop: shopExists });
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

// ======================= LOGIN =======================

router.post("/login-shop", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const shop = await Shop.findOne({ email }).select("+password");
    if (!shop) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, shop.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password" });

    sendShopToken(shop, 200, res);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// ======================= LOGOUT =======================

router.get("/logout", (req, res) => {
  res.cookie("shop_token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({ success: true, message: "Logout successful" });
});

// ======================= GET PROFILE =======================

router.get("/get-shop", isSeller, async (req, res) => {
  try {
    const shop = await Shop.findById(req.seller._id).select("-password");
    if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });

    res.status(200).json({ success: true, shop });
  } catch (error) {
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

// ======================= UPDATE AVATAR =======================

router.put("/update-shop-avatar", isSeller, async (req, res) => {
  try {
    const shop = await Shop.findById(req.seller._id);
    if (!shop) return res.status(404).json({ success: false, message: "Seller not found" });

    // Delete old avatar from Cloudinary
    if (shop.avatar?.public_id) {
      await cloudinary.uploader.destroy(shop.avatar.public_id);
    }

    const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "shopAvatars",
      width: 150,
      crop: "scale",
    });

    shop.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    await shop.save();
    res.status(200).json({ success: true, shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================= UPDATE INFO =======================

router.put("/update-seller-info", isSeller, async (req, res) => {
  try {
    const { shopName, description, address, phoneNumber, zipCode } = req.body;

    const shop = await Shop.findById(req.seller._id);
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

    // Delete avatar from Cloudinary
    if (seller.avatar?.public_id) {
      await cloudinary.uploader.destroy(seller.avatar.public_id);
    }

    await Shop.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Seller deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================= PAYMENT METHODS =======================

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
