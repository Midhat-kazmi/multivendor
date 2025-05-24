const express = require("express");
const router = express.Router();

// Placeholder for payment processing (Stripe removed)
router.post("/process", (req, res) => {
  // You can handle custom logic here later
  res.status(200).json({
    success: true,
    message: "Payment processing temporarily disabled.",
  });
});

// Placeholder for getting Stripe API key (Stripe removed)
router.get("/stripeapikey", (req, res) => {
  res.status(200).json({
    stripeApikey: "Stripe integration is currently disabled.",
  });
});

module.exports = router;
