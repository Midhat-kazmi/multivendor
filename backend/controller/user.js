const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const sendMail = require("../utils/sendMail");
const upload = require("../utils/multer"); // 
require("dotenv").config();
const { isAuthenticated } = require("../middleware/auth");


// ✅ Create User & Send Activation Link
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || !req.file) {
      return res.status(400).json({ success: false, message: "All fields including avatar are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // ✅ Correct URL format for frontend usage
    const avatarUrl = "/" + req.file.path.replace(/\\/g, "/");

    const userPayload = {
      name,
      email,
      password,
      avatar: {
        public_id: req.file.filename,
        url: avatarUrl,
      },
    };

    const activationToken = jwt.sign(userPayload, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
    const activationUrl = `http://localhost:5173/activation/${activationToken}`;

    await sendMail({
      email,
      subject: "Activate your account",
      message: `Hello ${name},\n\nClick the link to activate your account:\n${activationUrl}`,
    });

    return res.status(200).json({
      success: true,
      message: `Activation email sent to ${email}`,
    });
  } catch (error) {
    console.error("Create User Error:", error);
    return res.status(500).json({ success: false, message: "Error creating user" });
  }
};

// ✅ Activate User
const activateUser = async (req, res) => {
  try {
    const { activationToken } = req.body;

    if (!activationToken) {
      return res.status(400).json({ success: false, message: "No activation token provided" });
    }

    let newUserData;
    try {
      newUserData = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid or expired activation token" });
    }

    const userExists = await User.findOne({ email: newUserData.email });
    if (userExists) {
      return res.status(200).json({
        success: true,
        message: "Account is already activated. Please log in.",
        user: userExists,
      });
    }

    const user = await User.create(newUserData);

    return res.status(201).json({
      success: true,
      message: "Account activated successfully",
      user,
    });
  } catch (error) {
    console.error("Activation Error:", error);
    return res.status(500).json({ success: false, message: "Activation failed" });
  }
};


// ✅ Login User
// ✅ Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // ✅ Fix avatar path for frontend
    if (user.avatar && user.avatar.url) {
      const filename = path.basename(user.avatar.url.replace(/\\/g, "/"));
      user.avatar.url = `/uploads/${filename}`;
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


// ✅ Load User
router.get("/getuser", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -createdAt -updatedAt -__v");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get User Error:", error);
    return res.status(500).json({ success: false, message: "Error fetching user" });
  }
});



//Logout
const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};




// ✅ Routes
router.post("/create-user", upload.single("file"), createUser);
router.post("/activation", activateUser);
router.post("/login-user", loginUser);
router.get("/logout", logoutUser); 


module.exports = router;
