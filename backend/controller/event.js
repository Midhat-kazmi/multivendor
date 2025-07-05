const express = require("express");
const router = express.Router();
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const Shop = require("../model/shop");
const Event = require("../model/event");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");

// ================== CREATE EVENT ==================
router.post("/create-event", isSeller, async (req, res) => {
  try {
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop doesn't exist!" });
    }

    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    const eventData = {
      ...req.body,
      images: imagesLinks,
      shop,
    };

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Event creation error:", error);
    res.status(500).json({ success: false, message: "Event creation failed" });
  }
});

// ================== GET ALL EVENTS OF A SHOP ==================
router.get("/get-all-events/:id", async (req, res) => {
  try {
    const events = await Event.find({ shopId: req.params.id });
    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Get shop events error:", error);
    res.status(500).json({ success: false, message: "Failed to get shop events" });
  }
});

// ================== DELETE SHOP EVENT ==================
router.delete("/delete-shop-event/:id", isSeller, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Delete associated local image files
    event.images.forEach((img) => {
      const filePath = `uploads/${img.public_id}`;
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error("File delete error:", err);
        });
      }
    });

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully!",
    });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ success: false, message: "Event deletion failed" });
  }
});

// ================== GET ALL EVENTS ==================
router.get("/get-all-events", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Get all events error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
});

// ================== ADMIN: GET ALL EVENTS ==================
router.get("/admin-all-events", isAuthenticated, isAdmin("Admin"), async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Admin get events error:", error);
    res.status(500).json({ success: false, message: "Failed to load events" });
  }
});

module.exports = router;
