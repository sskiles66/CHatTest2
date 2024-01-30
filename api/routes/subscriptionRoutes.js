const { addSubscription, getSubscriptionsForUser } = require("../controllers/SubscriptionController");
const router = require("express").Router();



router.post("/add", addSubscription);

router.get("/get/:id", getSubscriptionsForUser);


module.exports = router;