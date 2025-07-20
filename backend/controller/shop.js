const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const Shop = require("../model/shop");
const sendMail = require("../utils/sendMail");
const sendShopToken = require("../utils/sendShopToken");

// Create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// ========== Create Shop ==========
router.post("/create-shop", async (req, res) => {
  try {
    const { shopName, email, password, address, zipCode, phoneNumber, avatar } = req.body;

    if (!shopName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingSeller = await Shop.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ success: false, message: "Seller already exists" });
    }

    const myCloud = await cloudinary.uploader.upload(avatar, {
      folder: "shopAvatars",
    });

    const seller = {
      shopName,
      email,
      password,
      address,
      zipCode,
      phoneNumber,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    };

    const activationToken = createActivationToken(seller);
    const activationUrl = `https://multivendor-five.vercel.app/activation/${activationToken}`;

    await sendMail({
      email: seller.email,
      subject: "Activate Your Seller Account!",
      message: `Hello ${seller.shopName}, activate your account:\n${activationUrl}`,
    });

    res.status(201).json({
      success: true,
      message: `Check your email (${seller.email}) to activate your account!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//  ========== Activate Seller Account ==========
router.post("/activation", async (req, res) => {
  try {
    const { activation_token } = req.body;

    if (!activation_token) {
      return res.status(400).json({ success: false, message: "No activation token provided" });
    }

    const newSeller = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    if (!newSeller) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    const existingSeller = await Shop.findOne({ email: newSeller.email });
    if (existingSeller) {
      return res.status(400).json({ success: false, message: "Seller already exists" });
    }

    const seller = await Shop.create(newSeller);
    sendShopToken(seller, 201, res);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Token expired or invalid" });
  }
});

// ========== Login Seller ==========
router.post("/login-shop", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const seller = await Shop.findOne({ email }).select("+password");
    if (!seller)
      return res.status(404).json({ success: false, message: "Seller not found" });

    const isValid = await seller.comparePassword(password);
    if (!isValid)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    sendShopToken(seller, 201, res, true);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== Load Seller ==========
router.get("/get-seller", isSeller, async (req, res) => {
  try {
    const seller = await Shop.findById(req.seller._id);
    if (!seller)
      return res.status(404).json({ success: false, message: "Seller not found" });

    res.status(200).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== Logout ==========
router.get("/logout", async (req, res) => {
  try {
    res.cookie("shop_token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== Get Shop Info ==========
router.get("/get-shop-info/:id", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop)
      return res.status(404).json({ success: false, message: "Seller not found" });

    res.status(200).json({ success: true, shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== Update Avatar ==========
router.put("/update-shop-avatar", isSeller, async (req, res) => {
  try {
    const seller = await Shop.findById(req.seller._id);
    if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

    if (seller.avatar?.public_id) {
      await cloudinary.uploader.destroy(seller.avatar.public_id);
    }

    const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
    });

    seller.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    await seller.save();
    res.status(200).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== Update Seller Info ==========
router.put("/update-seller-info", isSeller, async (req, res) => {
  try {
    const { shopName, description, address, phoneNumber, zipCode } = req.body;
    const seller = await Shop.findById(req.seller._id);
    if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

    seller.name = shopName;
    seller.description = description;
    seller.address = address;
    seller.phoneNumber = phoneNumber;
    seller.zipCode = zipCode;

    await seller.save();
    res.status(200).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== Admin: Get All Sellers ==========
router.get("/admin-all-sellers", isAuthenticated, isAdmin("Admin"), async (req, res) => {
  try {
    const sellers = await Shop.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, sellers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== Admin: Delete Seller ==========
router.delete("/admin-delete-seller/:id", isAuthenticated, isAdmin("Admin"), async (req, res) => {
  try {
    const seller = await Shop.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    if (seller.avatar?.public_id) {
      await cloudinary.uploader.destroy(seller.avatar.public_id);
    }

    await Shop.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Seller deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== Seller: Update Withdraw Method ==========
router.put("/update-payment-methods", isSeller, async (req, res) => {
  try {
    const { withdrawMethod } = req.body;
    const seller = await Shop.findByIdAndUpdate(req.seller._id, { withdrawMethod }, { new: true });
    res.status(200).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== Seller: Delete Withdraw Method ==========
router.delete("/delete-withdraw-methods", isSeller, async (req, res) => {
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
