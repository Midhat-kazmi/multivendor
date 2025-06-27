const express = require("express");
const router = express.Router();
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");


router.post("/create-order", async (req, res) => {
  try {
    const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

    const shopItemsMap = new Map();

    for (const item of cart) {
      const shopId = item.shopId;
      if (!shopItemsMap.has(shopId)) {
        shopItemsMap.set(shopId, []);
      }
      shopItemsMap.get(shopId).push(item);
    }

    const orders = [];

    for (const [shopId, items] of shopItemsMap) {
      const order = await Order.create({
        cart: items,
        shippingAddress,
        user,
        totalPrice,
        paymentInfo,
      });
      orders.push(order);
    }

    res.status(201).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all orders of a seller
router.get("/get-seller-all-orders/:shopId", async (req, res) => {
  try {
    const orders = await Order.find({
      "cart.shopId": req.params.shopId,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all orders of a seller
router.get("/get-seller-all-orders/:shopId", async (req, res) => {
  try {
    const orders = await Order.find({
      "cart.shopId": req.params.shopId,
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update order status (seller)
router.put("/update-order-status/:id", isSeller, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (req.body.status === "Transferred to delivery partner") {
      for (const o of order.cart) {
        await updateProductStock(o._id, -o.qty);
      }
    }

    order.status = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
      order.paymentInfo.status = "Succeeded";
      const serviceCharge = order.totalPrice * 0.1;
      await updateSellerBalance(req.seller.id, order.totalPrice - serviceCharge);
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, order });

    async function updateProductStock(productId, qtyChange) {
      const product = await Product.findById(productId);
      product.stock += qtyChange;
      product.sold_out -= qtyChange;
      await product.save({ validateBeforeSave: false });
    }

    async function updateSellerBalance(sellerId, amount) {
      const seller = await Shop.findById(sellerId);
      seller.availableBalance = amount;
      await seller.save();
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Refund request (user)
router.put("/order-refund/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = req.body.status;
    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order,
      message: "Order refund request submitted!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Accept refund (seller)
router.put("/order-refund-success/:id", isSeller, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = req.body.status;
    await order.save();

    if (req.body.status === "Refund Success") {
      for (const o of order.cart) {
        await updateProductStock(o._id, o.qty);
      }
    }

    res.status(200).json({ success: true, message: "Refund processed successfully" });

    async function updateProductStock(productId, qty) {
      const product = await Product.findById(productId);
      product.stock += qty;
      product.sold_out -= qty;
      await product.save({ validateBeforeSave: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// All orders for admin
router.get("/admin-all-orders", isAuthenticated, isAdmin("Admin"), async (req, res) => {
  try {
    const orders = await Order.find().sort({
      deliveredAt: -1,
      createdAt: -1,
    });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
