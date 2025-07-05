const express = require("express");
const router = express.Router();
const Messages = require("../model/message");
const cloudinary = require("cloudinary").v2;

// ========================= CREATE NEW MESSAGE =========================
router.post("/create-new-message", async (req, res) => {
  try {
    const { sender, text, conversationId, images } = req.body;

    let imageData;

    if (images) {
      const uploaded = await cloudinary.uploader.upload(images, {
        folder: "messages",
      });

      imageData = {
        public_id: uploaded.public_id,
        url: uploaded.secure_url,
      };
    }

    const message = new Messages({
      conversationId,
      sender,
      text: text || undefined,
      images: imageData || undefined,
    });

    await message.save();

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Create message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create message",
    });
  }
});

// ========================= GET ALL MESSAGES BY CONVERSATION ID =========================
router.get("/get-all-messages/:id", async (req, res) => {
  try {
    const messages = await Messages.find({
      conversationId: req.params.id,
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
});

module.exports = router;
