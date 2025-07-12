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
    const shop = req.seller; // use authenticated shop

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
      shopId: shop._id,
      shop: shop,
      images: imagesLinks,
    };

    //  LOG the event data before saving
    console.log("eventData:", eventData);

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      event,
    });

  } catch (error) {
    //  LOG the actual error
    console.error("Event creation error:", error.message, error.stack);
    
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================== GET ALL EVENTS OF A SHOP ==================
router.get("/get-all-events/:id", async (req, res) => {
  try {
    console.log("GET EVENTS for Shop ID:", req.params.id); 
    const events = await Event.find({ shopId: req.params.id });
    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Get shop events error:", error.message);
    res.status(500).json({ success: false, message: "Failed to get shop events" });
  }
});


// ================== DELETE SHOP EVENT ==================
router.delete("/delete-shop-event/:id", isSeller, async (req, res) => {
  console.log("Cookies:", req.cookies);
  console.log(" Deleting Event ID:", req.params.id);

  try {
    const event = await Event.findById(req.params.id);
    console.log(" Event from DB:", event);

    if (!event) {
      console.log(" Event NOT FOUND for ID:", req.params.id);
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    for (const img of event.images) {
      try {
        await cloudinary.uploader.destroy(img.public_id);
      } catch (err) {
        console.warn(" Failed to delete image:", img.public_id);
      }
    }

    await Event.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully!",
    });
  } catch (error) {
    console.error(" Delete error:", error);
    return res.status(500).json({ success: false, message: "Event deletion failed" });
  }
});


// ================== GET ALL EVENTS ==================
router.get("/get-all-events", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Get all events error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
});

// ================== ADMIN: GET ALL EVENTS ==================
router.get("/admin-all-events", isAuthenticated, isAdmin("Admin"), async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Admin get events error:", error.message);
    res.status(500).json({ success: false, message: "Failed to load events" });
  }
});

module.exports = router;
