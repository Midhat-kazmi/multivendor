const express = require("express");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const Shop = require("../model/shop");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const sendShopToken = require("../utils/sendShopToken");
const upload = require("../utils/multer");

// create shop
router.post("/create-shop", upload.single("avatar"), async (req, res) => {
  try {
    const { email, name, password, address, phoneNumber, zipCode } = req.body;
    const sellerEmail = await Shop.findOne({ email });

    if (sellerEmail) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const avatar = req.file
      ? {
          public_id: req.file.filename,
          url: `/uploads/${req.file.filename}`,
        }
      : null;

    const seller = { name, email, password, avatar, address, phoneNumber, zipCode };
    const activationToken = createActivationToken(seller);

    const activationUrl = `https://eshop-tutorial-pyri.vercel.app/seller/activation/${activationToken}`;

    await sendMail({
      email,
      subject: "Activate your Shop",
      emailMessage: `Hello ${name}, please click on the link to activate your shop: ${activationUrl}`,
    });

    res.status(201).json({
      success: true,
      message: `Please check your email: ${email} to activate your shop!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
};

// activate user
router.post("/activation", async (req, res) => {
  try {
    const { activation_token } = req.body;
    const newSeller = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

    if (!newSeller) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    const existingSeller = await Shop.findOne({ email: newSeller.email });
    if (existingSeller) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const seller = await Shop.create(newSeller);
    sendShopToken(seller, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// login shop
router.post("/login-shop", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide all fields!" });
    }

    const user = await Shop.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    sendShopToken(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// load shop
router.get("/getSeller", isSeller, async (req, res) => {
  try {
    const seller = await Shop.findById(req.seller._id);
    if (!seller) {
      return res.status(400).json({ success: false, message: "User doesn't exist" });
    }

    res.status(200).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// logout
router.get("/logout", (req, res) => {
  try {
    res.cookie("seller_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({ success: true, message: "Logged out successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// get shop info
router.get("/get-shop-info/:id", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    res.status(200).json({ success: true, shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// update shop profile picture
router.put("/update-shop-avatar", isSeller, upload.single("avatar"), async (req, res) => {
  try {
    const seller = await Shop.findById(req.seller._id);
    if (!seller) {
      return res.status(400).json({ success: false, message: "Seller not found" });
    }

    if (req.file) {
      seller.avatar = {
        public_id: req.file.filename,
        url: `/uploads/${req.file.filename}`,
      };
    }

    await seller.save();
    res.status(200).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// update seller info
router.put("/update-seller-info", isSeller, async (req, res) => {
  try {
    const { name, description, address, phoneNumber, zipCode } = req.body;
    const shop = await Shop.findById(req.seller._id);

    if (!shop) {
      return res.status(400).json({ success: false, message: "Seller not found" });
    }

    shop.name = name;
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

// all sellers - admin only
router.get("/admin-all-sellers", isAuthenticated, isAdmin("Admin"), async (req, res) => {
  try {
    const sellers = await Shop.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, sellers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// delete seller - admin only
router.delete("/delete-seller/:id", isAuthenticated, isAdmin("Admin"), async (req, res) => {
  try {
    const seller = await Shop.findById(req.params.id);
    if (!seller) {
      return res.status(400).json({ success: false, message: "Seller not found" });
    }

    await Shop.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Seller deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// update seller withdraw methods
router.put("/update-payment-methods", isSeller, async (req, res) => {
  try {
    const { withdrawMethod } = req.body;
    const seller = await Shop.findByIdAndUpdate(req.seller._id, { withdrawMethod }, { new: true });
    res.status(200).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// delete seller withdraw method
router.delete("/delete-withdraw-method", isSeller, async (req, res) => {
  try {
    const seller = await Shop.findById(req.seller._id);
    if (!seller) {
      return res.status(400).json({ success: false, message: "Seller not found" });
    }

    seller.withdrawMethod = null;
    await seller.save();
    res.status(200).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
