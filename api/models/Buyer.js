const mongoose = require("mongoose");

const BuyerSchema = new mongoose.Schema({
    username: {type: String, unique:true},
    password: String,
}, {timestamps: true});

const BuyerModel = mongoose.model("Buyer", BuyerSchema);

module.exports = BuyerModel;