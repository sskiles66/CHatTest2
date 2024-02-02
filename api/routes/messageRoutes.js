const {
  addMessage,
  getLimitedMessagesForSubscription,
  getAllMessagesForSubscription,
  deleteAllMessages,
  updateMessageSeen,
  getUnseenMessagesForUser,
  updateMessageText,
  deleteMessage
} = require("../controllers/MessageController");
const router = require("express").Router();

router.post("/message", addMessage);

// router.get("/message/:sub_id", getMessagesForSubscription);

// For some reason, have to have spec to seperate params, otherwise, whole thing breaks
// Extra params don't achieve anything right now.
router.get("/message/:sub_id/limited/:id", getLimitedMessagesForSubscription);

router.get("/message/:sub_id/all/:id", getAllMessagesForSubscription);

router.delete("/message", deleteAllMessages);

router.delete("/message/delete/:id", deleteMessage);

router.patch("/message/:id", updateMessageSeen);

router.patch("/message/edit/:id", updateMessageText);

router.get("/message/notif/:user_id", getUnseenMessagesForUser);

module.exports = router;
