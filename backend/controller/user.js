const express = require("express");
const router = express.Router();
const path = require("path");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const User = require("../model/user");
const sendToken = require("../utils/jwtToken");
const sendMail = require("../utils/sendMail");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// =============== Register User ===============
router.post("/create-user", async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password || !avatar) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const myCloud = await cloudinary.uploader.upload(avatar, {
      folder: "avatars",
    });

    const user = {
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    };

    const activationToken = createActivationToken(user);

    //  Use frontend domain from env var (important for production)
    const activationUrl = `https://multivendor-five.vercel.app/activation/${activationToken}`;

    await sendMail({
      email: user.email,
      subject: "Activate Your Account!",
      message: `Hello ${user.name},\n\nPlease click the link below to activate your account:\n${activationUrl}\n\nIf you did not request this, you can ignore this email.`,
    });

    res.status(201).json({
      success: true,
      message: `Please check your email (${user.email}) to activate your account!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔐 Create Activation Token Helper
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};
// ✅ Activate user account
router.post("/activation", async (req, res) => {
  try {
    const { activation_token } = req.body;

    if (!activation_token) {
      return res.status(400).json({ success: false, message: "No activation token provided" });
    }

    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

    if (!newUser) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    const existingUser = await User.findOne({ email: newUser.email });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create(newUser);
    sendToken(user, 201, res);
  } catch (error) {
    console.error("Activation error:", error.message);
    return res.status(500).json({ success: false, message: "Token expired or invalid" });
  }
});

// =============== Login ===============
router.post("/login-user", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "All fields are required!" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ success: false, message: "User not found!" });

    const isValid = await user.comparePassword(password);
    if (!isValid)
      return res.status(400).json({ success: false, message: "Invalid credentials!" });

    sendToken(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =============== Load User ==============
router.get("/get-user", isAuthenticated, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Not logged in" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found!" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =============== Logout ===============
router.get("/logout", isAuthenticated, (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0), 
  });

  res.status(200).json({ success: true, message: "Logged out successfully!" });
});


// =============== Update User Info ===============
router.put("/update-user-info", isAuthenticated, async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const user = await User.findOne({ email }).select("+password");

    const isValid = await user.comparePassword(password);
    if (!isValid)
      return res.status(400).json({ success: false, message: "Incorrect password!" });

    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;
    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =============== Update Avatar ===============
router.put("/update-avatar", isAuthenticated, async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    if (req.body.avatar !== "") {
      await cloudinary.uploader.destroy(user.avatar.public_id);

      const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
      });

      user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =============== Update Addresses ===============
router.put("/update-user-addresses", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const existingType = user.addresses.find(
      (addr) => addr.addressType === req.body.addressType
    );

    if (existingType) {
      return res
        .status(400)
        .json({ success: false, message: `${req.body.addressType} already exists` });
    }

    const existingAddress = user.addresses.find((addr) => addr._id === req.body._id);
    if (existingAddress) {
      Object.assign(existingAddress, req.body);
    } else {
      user.addresses.push(req.body);
    }

    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =============== Delete Address ===============
router.delete("/delete-user-address/:id", isAuthenticated, async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { addresses: { _id: req.params.id } } }
    );
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =============== Update Password ===============
router.put("/update-user-password", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(req.body.oldPassword);

    if (!isMatch)
      return res.status(400).json({ success: false, message: "Old password is incorrect" });

    if (req.body.newPassword !== req.body.confirmPassword)
      return res.status(400).json({ success: false, message: "Passwords do not match" });

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =============== Get User by ID ===============
router.get("/user-info/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =============== Admin: Get All Users ===============
router.get("/admin-all-users", isAuthenticated, isAdmin("Admin"), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =============== Admin: Delete User ===============
router.delete("/admin-delete-user/:id", isAuthenticated, isAdmin("Admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    //  Delete avatar from Cloudinary
    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    //  Delete user from MongoDB
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


module.exports = router;
