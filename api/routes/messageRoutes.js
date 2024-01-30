const {addMessage, getMessagesForSubscription, deleteAllMessages, updateMessage, getUnseenMessagesForUser} = require("../controllers/MessageController");
const router = require("express").Router();


router.post("/message", addMessage);

router.get("/message/:sub_id", getMessagesForSubscription);

router.delete("/message", deleteAllMessages);

router.patch("/message/:id", updateMessage);

router.get("/message/notif/:user_id", getUnseenMessagesForUser);


module.exports = router;