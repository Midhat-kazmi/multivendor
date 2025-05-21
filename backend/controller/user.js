const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const sendMail = require("../utils/sendMail");
const upload = require("../utils/multer");
require("dotenv").config();
const { isAuthenticated } = require("../middleware/auth");

const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// ✅ Create User & Send Activation Email
const createUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password || !avatar) {
      return res.status(400).json({
        success: false,
        message: "All fields including avatar are required",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const avatarFilename = path.basename(avatar.replace(/\\/g, "/"));
    const avatarUrl = `/uploads/${avatarFilename}`;

    const user = { name, email, password, avatar: { url: avatarUrl } };

    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:5173/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email: ${user.email} to activate your account.`,
      });
    } catch (error) {
      console.error("Email sending failed:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to send activation email",
      });
    }
  } catch (error) {
    console.error("User creation failed:", error);
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ✅ Activate User
const activateUser = async (req, res) => {
  try {
    const { activation_token } = req.body;

    if (!activation_token) {
      return res.status(400).json({ success: false, message: "No activation token provided" });
    }

    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    let { name, email, password, avatar } = newUser;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(200).json({
        success: true,
        message: "Account already activated. Please log in.",
        user: userExists,
      });
    }

    // ✅ Fix avatar URL (extract filename and re-assign)
    const filename = path.basename(avatar?.url?.replace(/\\/g, "/") || "");
    avatar = {
      public_id: filename,
      url: `/uploads/${filename}`,
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      avatar,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account activated successfully",
      user,
    });
  } catch (error) {
    console.error("Activation failed:", error);
    return res.status(500).json({ success: false, message: "Activation failed" });
  }
};

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

    // ✅ Fix avatar path
    if (user.avatar && user.avatar.url) {
      const filename = path.basename(user.avatar.url.replace(/\\/g, "/"));
      user.avatar = {
        public_id: filename,
        url: `/uploads/${filename}`,
      };
    }

    const token = user.getJwtToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

// ✅ Logout User
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

// ✅ Get Authenticated User
router.get("/getuser", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -createdAt -updatedAt -__v");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Normalize avatar path
    if (user.avatar && user.avatar.url) {
      const filename = path.basename(user.avatar.url.replace(/\\/g, "/"));
      user.avatar = {
        public_id: filename,
        url: `/uploads/${filename}`,
      };
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get User Error:", error);
    return res.status(500).json({ success: false, message: "Error fetching user" });
  }
});

// ✅ Routes
router.post("/create-user", upload.single("file"), createUser);
router.post("/activation", activateUser);
router.post("/login-user", loginUser);
router.get("/logout", logoutUser);

module.exports = router;
