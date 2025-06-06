const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const upload = require("../utils/multer");
const router = express.Router();
const Product = require("../model/product");
const Shop = require("../model/shop");

// Create product with multer upload
router.post(
  "/create-product",
  upload.array("images", 5),
  async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return res.status(400).json({ success: false, message: "Invalid shop ID" });
      }

      // req.files contains array of uploaded files from multer
      const imagesLinks = req.files.map((file) => ({
        public_id: file.filename,
        url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
      }));

      const productData = {
        ...req.body,
        images: imagesLinks,
        shop,
      };

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error("Create Product Error:", error);
      return next(error);
    }
  }
);
// Get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  (async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(error);
    }
  })
);

// Delete product of a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      await Product.deleteOne({ _id: req.params.id });

      res.status(200).json({
        success: true,
        message: "Product deleted successfully!",
      });
    } catch (error) {
      return next(error);
    }
  }
);


// Get all products
router.get(
  "/get-all-products",
  (async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(error);
    }
  })
);




// Admin: Get all products
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  (async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(error);
    }
  })
);

router.post('/upload', upload.array, (req, res) => {
  // Handle multiple uploads
});

module.exports = router;
