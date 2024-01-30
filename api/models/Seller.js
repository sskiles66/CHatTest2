const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema({
    username: {type: String, unique:true},
    password: String,
}, {timestamps: true});

const SellerModel = mongoose.model("Seller", SellerSchema);

module.exports = SellerModel;