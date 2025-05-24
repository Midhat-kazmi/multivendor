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
const { isAuthenticated } = require("../middleware/auth");

// Create Activation Token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
};

// Register user and send activation email
router.post("/create-user", upload.single("avatar"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const file = req.file;

    if (!name || !email || !password || !file) {
      return res.status(400).json({ success: false, message: "All fields including avatar are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const avatarData = {
      public_id: file.filename,
      url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
    };

    const user = { name, email, password, avatar: avatarData };
    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:5173/activation/${activationToken}`;

    await sendMail({
      email: user.email,
      subject: "Activate your account",
      message: `Hello ${user.name}, please click the link to activate your account: ${activationUrl}`,
    });

    res.status(201).json({ success: true, message: `Please check your email: ${user.email} to activate your account.` });
  } catch (error) {
    console.error("User creation failed:", error);
    res.status(500).json({ success: false, message: "Something went wrong during registration." });
  }
});

// ✅ Activate User (updated to hash password before saving)
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
router.post(
  "/login-user",
  (async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next("Please provide the all fields!", 400);
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next("User doesn't exists!", 400);
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next("Please provide the correct information", 400
        );
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(error.message, 500);
    }
  })
);


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
router.put("/update-avatar", isAuthenticated, upload.single("avatar"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.avatar?.public_id) {
      const oldPath = path.join(__dirname, "..", "uploads", user.avatar.public_id);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const filename = req.file.filename;
    const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;
    user.avatar = { public_id: filename, url: avatarUrl };

    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update avatar" });
  }
});

module.exports = router;
