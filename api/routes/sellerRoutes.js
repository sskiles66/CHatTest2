const {sellerRegister, sellerLogin} = require("../controllers/SellerController");
const router = require("express").Router();



router.post("/register", sellerRegister);

router.post("/login", sellerLogin);


module.exports = router;