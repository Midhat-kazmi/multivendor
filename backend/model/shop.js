const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const shopSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: [true, "Please enter your shop name!"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your email!"],
    unique: true,
    lowercase: true,
    trim: true,
  },

  zipCode: {
    type: String,
    required: [true, "Please enter your zip code!"],
  },
  address: {
    type: String,
    required: [true, "Please enter your address!"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password!"],
    minLength: [4, "Password should be greater than 4 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
       required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "seller",
  },
  description: {
  type: String,
  default: "", // optional
},
phoneNumber: {
  type: String,
  default: "", // optional
},

});
//shopSchema.pre("save", async function (next) {
  //if (!this.isModified("password")) return next();

  //try {
  //  this.password = await bcrypt.hash(this.password, 10);
   // next();
  //} catch (err) {
  //  return next(err);
  //}
//});

//  Method to get signed JWT token
shopSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
};

// Compare plain and hashed password
shopSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Shop", shopSchema);
