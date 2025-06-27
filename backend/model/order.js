const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      shopId: {
        type: String,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
      discountPrice: {
        type: Number,
        required: true,
      },
      name: String,
    },
  ],
  shippingAddress: {
    type: Object,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Processing",
  },
  paymentInfo: {
    id: { type: String },
    status: { type: String },
    type: { type: String },
  },
  paidAt: {
    type: Date,
    default: Date.now(),
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Order", orderSchema);
