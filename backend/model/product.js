const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Product Name!"],
  },
  description: {
    type: String,
    required: [true, "Please Enter Your Product description!"],
  },
  category: {
    type: String,
    required: [true, "Please Enter Your Product category!"],
  },
  tags: {
    type: String,
    required: [true, "Please Enter Your Product Tags!"],
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "Please Enter Your Discount Price!"],
  },
  stock: {
    type: Number,
    required: [true, "Please Enter Your Product Stock!"],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  shopId: {
    type: String,
    required: true,
  },
  shop: {
    type: Object,
    required: true,
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: Object,
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
      productId: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  ratings: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("product", ProductSchema);