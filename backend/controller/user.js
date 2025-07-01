const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const sendMail = require("../utils/sendMail");
const upload = require("../utils/multer");
require("dotenv").config();
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// Create Activation Token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
};

// Create token and save in cookie
const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };

  res.status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      user,
      token,
    });
};

// Register user and send activation email
router.post("/create-user", async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = {
      name,
      email,
      password,
      avatar, // store avatar as base64 or image URL
    };

    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:5173/activation/${activationToken}`;

    await sendMail({
      email: user.email,
      subject: "Activate your account",
      message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
    });

    return res.status(201).json({
      success: true,
      message: `Please check your email: ${user.email} to activate your account.`,
    });
  } catch (error) {
    console.error("Create User Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Activate User
router.post("/activation", async (req, res) => {
  try {
    const { activation_token } = req.body;
    if (!activation_token) {
      return res.status(400).json({ success: false, message: "No activation token provided" });
    }

    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    const { name, email, password, avatar } = newUser;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(200).json({ success: true, message: "Account already activated. Please log in.", user: userExists });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, avatar });

    res.status(201).json({ success: true, message: "Account activated successfully", user });
  } catch (error) {
    console.error("Activation failed:", error);
    res.status(500).json({ success: false, message: "Activation failed" });
  }
});

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Wrong password" });
    }

    const token = user.getJwtToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};

router.post("/login-user", loginUser);

// Get current user
router.get("/getuser", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -__v -createdAt -updatedAt");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
});

// Logout User
router.get("/logout", isAuthenticated, (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// Update user info
router.put("/update-user-info", isAuthenticated, async (req, res) => {
  try {
    const { email, password, phoneNumber, name } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ success: false, message: "Incorrect password" });

    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;

    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating user info" });
  }
});

// Update avatar
router.put("/update-avatar", isAuthenticated, async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.avatar = avatar;
    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Update Avatar Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to update avatar" });
  }
});

// Update User Address
router.put("/update-user-addresses", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const { country, city, address1, address2, zipCode, addressType } = req.body;

    const newAddress = { country, city, address1, address2, zipCode, addressType };

    const isDuplicate = user.addresses.some(
      (addr) => addr.address1 === address1 && addr.address2 === address2 && addr.zipCode === zipCode
    );

    if (isDuplicate) {
      return res.status(400).json({ success: false, message: "Address already exists" });
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(200).json({ success: true, message: "Address added successfully", user });
  } catch (error) {
    console.error("Update Address Error:", error);
    res.status(500).json({ success: false, message: "Failed to update address" });
  }
});

router.delete("/delete-user-address/:id", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.id;

    await User.updateOne({ _id: userId }, { $pull: { addresses: { _id: addressId } } });

    const user = await User.findById(userId);
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Delete address failed:", error);
    res.status(500).json({ success: false, message: "Failed to delete address" });
  }
});

router.put("/update-user-password", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isPasswordMatched = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ success: false, message: "Old password is incorrect" });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    user.password = await bcrypt.hash(req.body.newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ success: false, message: "Failed to update password" });
  }
});

router.get("/user-info/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get user info error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user info" });
  }
});

router.delete("/delete-user/:id", isAuthenticated, isAdmin("Admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
});

module.exports = router;
