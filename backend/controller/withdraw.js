const Shop = require("../model/shop");
const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const Withdraw = require("../model/withdraw");
const sendMail = require("../utils/sendMail");
const router = express.Router();

// create withdraw request --- only for seller
router.post("/create-withdraw-request", isSeller, async (req, res) => {
  try {
    const { amount } = req.body;

    const data = {
      seller: req.seller,
      amount,
    };

    try {
      await sendMail({
        email: req.seller.email,
        subject: "Withdraw Request",
        message: `Hello ${req.seller.name}, Your withdraw request of ${amount}$ is processing. It will take 3days to 7days to processing! `,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message || error });
    }

    const withdraw = await Withdraw.create(data);

    const shop = await Shop.findById(req.seller._id);

    shop.availableBalance = shop.availableBalance - amount;

    await shop.save();

    res.status(201).json({
      success: true,
      withdraw,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || error });
  }
});

// get all withdraws --- admin
router.get(
  "/get-all-withdraw-request",
  isAuthenticated,
  isAdmin("Admin"),
  async (req, res) => {
    try {
      const withdraws = await Withdraw.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        withdraws,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || error });
    }
  }
);

// update withdraw request ---- admin
router.put(
  "/update-withdraw-request/:id",
  isAuthenticated,
  isAdmin("Admin"),
  async (req, res) => {
    try {
      const { sellerId } = req.body;

      const withdraw = await Withdraw.findByIdAndUpdate(
        req.params.id,
        {
          status: "succeed",
          updatedAt: Date.now(),
        },
        { new: true }
      );

      const seller = await Shop.findById(sellerId);

      const transection = {
        _id: withdraw._id,
        amount: withdraw.amount,
        updatedAt: withdraw.updatedAt,
        status: withdraw.status,
      };

      seller.transections = [...seller.transections, transection];

      await seller.save();

      try {
        await sendMail({
          email: seller.email,
          subject: "Payment confirmation",
          message: `Hello ${seller.name}, Your withdraw request of ${withdraw.amount}$ is on the way. Delivery time depends on your bank's rules it usually takes 3days to 7days.`,
        });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message || error });
      }

      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || error });
    }
  }
);

module.exports = router;
