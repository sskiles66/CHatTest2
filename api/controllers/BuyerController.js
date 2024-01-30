
const BuyerModel = require("../models/Buyer");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const buyerRegister = async (req, res) => {
    const {username,password} = req.body;
    
    try {
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const createdUser = await BuyerModel.create({username,password: hashedPassword});
        jwt.sign({userId:createdUser._id, username}, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        // FOr sending cookie to different localhosts (I think)
        res.cookie("token", token, {sameSite: "none", secure:true}).status(201).json({
            id: createdUser._id,
  
        });
    });
    }catch (err){
        if (err) throw err;
    }
}

const buyerLogin = async (req, res) => {
    const {username, password} = req.body;
    const foundUser = await BuyerModel.findOne({username});
    if (foundUser){
        const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
        if (passwordCorrect){
            jwt.sign({userId:foundUser._id, username}, jwtSecret, {}, (err, token) => {
                res.cookie("token", token, {sameSite: "none", secure:true}).json({
                    id: foundUser._id
                })
            })
        }
    }
}

module.exports = {
    buyerRegister,
    buyerLogin
}