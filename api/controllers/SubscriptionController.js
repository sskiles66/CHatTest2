const SubscriptionModel = require("../models/Subscriptions");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const addSubscription = async (req, res) => {
    const {buyer_id, seller_id, subscription} = req.body;
    try {
        const newSub = await SubscriptionModel.create({buyer_id, seller_id, subscription});
        res.status(200).json(newSub)
    } catch (err) {
        if (err) throw err;
    }
}
const getSubscriptionsForUser = async (req, res) => {
    try {
        const subscriptions = await SubscriptionModel.find({
            $or: [{ buyer_id: req.params.id }, { seller_id: req.params.id }]
          })
          .sort({ updatedAt: -1 })
          .lean(); // Sort by updatedAt in descending order
          
        if(subscriptions){
            res.status(200).json(subscriptions)
        }
    } catch (err) {
        if (err) throw err;
    }
}



module.exports = {
    addSubscription,
    getSubscriptionsForUser
}