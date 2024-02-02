const MessageModel = require("../models/Message");
const SubscriptionModel = require("../models/Subscriptions");
const dotenv = require("dotenv");
dotenv.config();



const addMessage = async (req, res) => {
    const {subscription_id, buyer, seller, sender, senderType, receiver, receiverType, text, date_now_exclusion, seen} = req.body;
    if (text == ""){
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const newMessage = await MessageModel.create({subscription_id, buyer, seller, sender, senderType, receiver, receiverType, text, date_now_exclusion, seen});
        const subscriptions = await SubscriptionModel.findOneAndUpdate({_id: subscription_id }, {
            $set: {
              updatedAt: Date.now()
            },
          } );

        res.status(200).json(newMessage)
    } catch (err) {
        if (err) throw err;
    }
}

const getMessagesForSubscription = async (req, res) => {
    try {
        // const messages = await MessageModel.find({subscription_id: req.params.sub_id})
        const messages = await MessageModel.find({
            subscription_id: req.params.sub_id,
            $or: [{ buyer: req.params.id }, { seller: req.params.id }],
          })
        // This is just to get the 10 most recent messages.
        .sort({createdAt: -1})
        .limit(10)
        .lean();
        messages.reverse();
        if(messages){
            res.status(200).json(messages)
        }
    } catch (err) {
        if (err) throw err;
    }
}

const deleteAllMessages = async (req, res) => {
    try {
        const messages = await MessageModel.deleteMany({});
        if(messages){
            res.status(200).json(messages)
        }
    } catch (err) {
        if (err) throw err;
    }
}

const updateMessageSeen = async (req, res) => {
    try {
        const {subscription_id, buyer, seller, sender, senderType, receiver, receiverType, text, date_now_exclusion, seen} = req.body;
        const updatedMessage = await MessageModel.findOneAndUpdate({_id: req.params.id }, {
            $set: {
              seen: true
            },
          } );
          res.status(200).json(updatedMessage)
    } catch (err) {
        if (err) throw err;
    }
}

const updateMessageText = async (req, res) => {
    try {
        const {subscription_id, buyer, seller, sender, senderType, receiver, receiverType, text, date_now_exclusion, seen} = req.body;
        const updatedMessage = await MessageModel.findOneAndUpdate({_id: req.params.id }, {
            $set: {
              text: text
            },
          } );
          res.status(200).json(updatedMessage)
    } catch (err) {
        if (err) throw err;
    }
}

const getUnseenMessagesForUser = async (req, res) => {
    try {
        const messages = await MessageModel.find({receiver: req.params.user_id, seen: false}).lean();
        // console.log(messages);
        if (messages) {
            res.status(200).json(messages)
        }
        
    } catch (err) {
        if (err) throw err;
    }
}

const deleteMessage = async (req, res) => {
    const { id } = req.params;     //Params gets whatever id that is in the search bar

    const message = await MessageModel.findOneAndDelete({_id: id});  //Mongo id: our param id

    if (!message){
        return res.status(400).json({error: "Item does not exist"});
    }

    res.status(200).json(message);
}



module.exports = {
    addMessage,
    getMessagesForSubscription,
    deleteAllMessages,
    updateMessageSeen,
    getUnseenMessagesForUser,
    updateMessageText,
    deleteMessage
}