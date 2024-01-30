const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
    buyer_id: {
        type: Schema.Types.ObjectId,
        ref: 'Buyer'
    },
    seller_id: {
        type: Schema.Types.ObjectId,
        ref: 'Seller'
    },
    subscription: {
        type: String,
        required: true
    },
    // last_message: {
    //     type: Number,
    //     required: true
    // }
}, {timestamps: true});

const SubscriptionModel = mongoose.model("Subscription", SubscriptionSchema);

module.exports = SubscriptionModel;