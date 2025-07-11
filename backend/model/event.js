const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your event product Name!"],
  },
  description: {
    type: String,
    required: [true, "Please Enter Your event Product discription!"],
  },
  category: {
    type: String,
    required: [true, "Please Enter Your event Product category!"],
  },
  start_Date: {
    type: Date,
    required: true,
  },
  end_Date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "Running",
  },
  tags: {
    type: String,
    required: [true, "Please Enter Your event Product Tags!"],
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "Please Enter Your event Discount Price!"],
  },
  stock: {
    type: Number,
    required: [true, "Please Enter Your event Product Stock!"],
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("event", EventSchema);