const Conversation = require("../model/conversation");
const express = require("express");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const router = express.Router();

// create a new conversation
router.post("/create-new-conversation", async (req, res) => {
  try {
    const { groupTitle, userId, sellerId } = req.body;

    const isConversationExist = await Conversation.findOne({ groupTitle });

    if (isConversationExist) {
      const conversation = isConversationExist;
      res.status(201).json({
        success: true,
        conversation,
      });
    } else {
      const conversation = await Conversation.create({
        members: [userId, sellerId],
        groupTitle: groupTitle,
      });

      res.status(201).json({
        success: true,
        conversation,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || error });
  }
});

// get seller conversations
router.get("/get-all-conversation-seller/:id", isSeller, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: {
        $in: [req.params.id],
      },
    }).sort({ updatedAt: -1, createdAt: -1 });

    res.status(201).json({
      success: true,
      conversations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || error });
  }
});

// get user conversations
router.get("/get-all-conversation-user/:id", isAuthenticated, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: {
        $in: [req.params.id],
      },
    }).sort({ updatedAt: -1, createdAt: -1 });

    res.status(201).json({
      success: true,
      conversations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || error });
  }
});

// update the last message
router.put("/update-last-message/:id", async (req, res) => {
  try {
    const { lastMessage, lastMessageId } = req.body;

    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { lastMessage, lastMessageId },
      { new: true } // to return updated doc
    );

    res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || error });
  }
});

module.exports = router;
