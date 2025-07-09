const express = require("express");
const router = express.Router();
const CouponCode = require("../model/couponCode");
const { isSeller } = require("../middleware/auth");

// ========== Create Coupon ==========
router.post("/create-coupon-code", isSeller, async (req, res) => {
  try {
    const existingCoupon = await CouponCode.findOne({ name: req.body.name });

    if (existingCoupon) {
      return res.status(400).json({ success: false, message: "Coupon code already exists!" });
    }

    const createdCoupon = await CouponCode.create(req.body);

    res.status(201).json({
      success: true,
      coupon: createdCoupon,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== Get All Coupons for a Shop ==========
router.get("/get-coupon/:id", isSeller, async (req, res) => {
  try {
    const couponCodes = await CouponCode.find({ shopId: req.seller.id });

    res.status(200).json({
      success: true,
      couponCodes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== Delete Coupon ==========
router.delete("/delete-coupon/:id", isSeller, async (req, res) => {
  try {
    const coupon = await CouponCode.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon code doesn't exist!" });
    }

    // Optional: Ensure only the coupon's shop can delete it
    if (coupon.shopId.toString() !== req.seller._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this coupon" });
    }

    await coupon.deleteOne();

    res.status(200).json({
      success: true,
      message: "Coupon code deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== Get Coupon by Name ==========
router.get("/get-coupon-value/:name", async (req, res) => {
  try {
    const couponCode = await CouponCode.findOne({ name: req.params.name });

    if (!couponCode) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.status(200).json({
      success: true,
      couponCode,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
