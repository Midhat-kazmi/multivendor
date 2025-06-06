const express = require("express");
const path = require("path");
const fs = require("fs");
const Shop = require("../model/shop");
const Event = require("../model/event");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const upload = require("../utils/multer");
const router = express.Router();

// Create Event
router.post(
  "/create-event",
  upload.array("images", 5),
  async (req, res, next) => {
    try {
      console.log("Files received:", req.files);
      console.log("Body received:", req.body);

      const {
        name,
        description,
        category,
        startDate,
        finishDate,
        originalPrice,
        discountPrice,
        stock,
        shopId,
        tags,
      } = req.body;

      // Validate required fields
      if (
        !name ||
        !description ||
        !category ||
        !startDate ||
        !finishDate ||
        !discountPrice ||
        !stock ||
        !shopId ||
        !req.files ||
        req.files.length === 0
      ) {
        if (req.files) {
          req.files.forEach((file) => {
            fs.unlinkSync(file.path);
          });
        }
        return res.status(400).json({
          success: false,
          message: "Please provide all required fields including images",
        });
      }

      const shop = await Shop.findById(shopId);
      if (!shop) {
        req.files.forEach((file) => {
          fs.unlinkSync(file.path);
        });
        return res
          .status(400)
          .json({ success: false, message: "Invalid shop ID" });
      }

      const imagesLinks = req.files.map((file) => ({
        public_id: file.filename,
        url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
      }));

      const eventData = {
        name,
        description,
        category,
        startDate: new Date(startDate),
        finishDate: new Date(finishDate),
        originalPrice: originalPrice || 0,
        discountPrice,
        stock,
        images: imagesLinks,
        shop,
        shopId,
        tags: tags || "",
      };

      const event = await Event.create(eventData);

      res.status(201).json({
        success: true,
        event,
      });
    } catch (error) {
      console.error("Create Event Error:", error);
      if (req.files) {
        req.files.forEach((file) => {
          fs.unlinkSync(file.path);
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message || "Event creation failed",
      });
    }
  }
);

// Get All Events
router.get("/get-all-events", async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, events });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch events" });
  }
});

// Get Events of a Specific Shop
router.get("/get-all-events/:id", async (req, res, next) => {
  try {
    const events = await Event.find({ shopId: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, events });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error fetching events" });
  }
});

// Delete Event
router.delete("/delete-shop-event/:id", isSeller, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    console.log(req.seller._id);

    // Verify shop ownership
    if (event.shopId.toString() !== req.seller._id.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You are not authorized to delete this event",
        });
    }

    // Delete image files from uploads folder
    event.images.forEach((img) => {
      const filePath = path.join(__dirname, "..", "uploads", img.public_id);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Event.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Event deleted successfully!",
    });
  } catch (error) {
    console.error("Delete Event Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error deleting event" });
  }
});

// Admin: Get All Events
router.get(
  "/admin-all-events",
  isAuthenticated,
  isAdmin("Admin"),
  async (req, res, next) => {
    try {
      const events = await Event.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, events });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to load events" });
    }
  }
);

module.exports = router;
