const Messages = require("../model/message");
const express = require("express");
const router = express.Router();

// create new message
router.post("/create-new-message", async (req, res) => {
  try {
    const messageData = req.body;

    // Removed Cloudinary image upload logic
    // You can keep this part if you use another image upload solution
    // Otherwise, just pass images as-is from frontend if applicable
    messageData.conversationId = req.body.conversationId;
    messageData.sender = req.body.sender;
    messageData.text = req.body.text;

    const message = new Messages({
      conversationId: messageData.conversationId,
      text: messageData.text,
      sender: messageData.sender,
      images: messageData.images ? messageData.images : undefined,
    });

    await message.save();

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// get all messages with conversation id
router.get("/get-all-messages/:id", async (req, res) => {
  try {
    const messages = await Messages.find({
      conversationId: req.params.id,
    });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
