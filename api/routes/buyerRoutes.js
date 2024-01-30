const {buyerRegister, buyerLogin} = require("../controllers/BuyerController");
const router = require("express").Router();



router.post("/register", buyerRegister);

router.post("/login", buyerLogin);


module.exports = router;