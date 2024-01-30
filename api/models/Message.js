
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    subscription_id: {
        type: Schema.Types.ObjectId,
        ref: 'Subscription'
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'Buyer'
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Seller'
    },
    sender: {
        type: Schema.Types.ObjectId,
        refPath: 'senderType'
    },
    senderType: {
        type: String,
        enum: ['Buyer', 'Seller']
    },
    receiver: {
        type: Schema.Types.ObjectId,
        refPath: 'senderType'
    },
    receiverType: {
        type: String,
        enum: ['Buyer', 'Seller']
    },
    text: {
        type: String,
        required: true
    },
    date_now_exclusion: {
        type: Number,
        required: true
    },
    seen: {
        type: Boolean,
        required: true
    }
}, {timestamps: true});

const MessageModel = mongoose.model("Message", MessageSchema);

module.exports = MessageModel;