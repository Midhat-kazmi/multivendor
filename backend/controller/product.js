const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const upload = require("../utils/multer");
const Product = require("../model/product");
const Shop = require("../model/shop");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const router = express.Router();

// Create product with Cloudinary
router.post("/create-product", upload.array("file", 5), async (req, res, next) => {
  try {
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(400).json({ success: false, message: "Invalid shop ID" });
    }

    const imagesLinks = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "products",
      });

      imagesLinks.push({ public_id: result.public_id, url: result.secure_url });
      fs.unlinkSync(file.path); // delete local file after upload
    }

    const productData = {
      ...req.body,
      images: imagesLinks,
      shop,
    };

    const product = await Product.create(productData);

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Create Product Error:", error);
    return next(error);
  }
});

// Get all products of a shop
router.get("/get-all-products-shop/:id", async (req, res, next) => {
  try {
    const products = await Product.find({ shopId: req.params.id });
    res.status(200).json({ success: true, products });
  } catch (error) {
    return next(error);
  }
});

// Delete product of a shop
router.delete("/delete-shop-product/:id", isSeller, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({ success: true, message: "Product deleted successfully!" });
  } catch (error) {
    return next(error);
  }
});


// Get all products
router.get("/get-all-products", async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    return next(error);
  }
});

// Admin: Get all products
router.get("/admin-all-products", isAuthenticated, isAdmin("Admin"), async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    return next(error);
  }
});

router.post("/upload", upload.array(), (req, res) => {
  // Handle multiple uploads (not implemented)
});

module.exports = router;
