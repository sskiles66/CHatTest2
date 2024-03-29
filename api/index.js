const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const ws = require("ws");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const buyerRoutes = require("./routes/buyerRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

mongoose.connect(process.env.MONGO_URI);

app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json("no token");
  }
});

app.use("/buyer", buyerRoutes);

app.use("/seller", sellerRoutes);

app.use("/subscription", subscriptionRoutes);

app.use("/chat", messageRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Listen for requests using Port number from .env file
    const server = app.listen(4040, () => {
      console.log("connected to db and listening on port", 4040);
    });

    const wss = new ws.WebSocketServer({ server });
    wss.on("connection", (connection, req) => {

      // read username and id form the cookie for this connection
      const cookies = req.headers.cookie;
      if (cookies) {
        const tokenCookieString = cookies
          .split(";")
          .find((str) => str.startsWith("token="));
        if (tokenCookieString) {
          const token = tokenCookieString.split("=")[1];
          if (token) {
            jwt.verify(token, jwtSecret, {}, (err, userData) => {
              if (err) throw err;
              const { userId, username } = userData;
              connection.userId = userId;
              connection.username = username;
            });
          }
        }
      }

      console.log("connected");

      // This code runs when a message has been sent from the client.
      connection.on("message", (message) => {
        const messageData = JSON.parse(message.toString());

        const {
          event,
          chatOption,
          buyer,
          seller,
          sender,
          senderType,
          receiver,
          receiverType,
          text,
          date_now_exclusion,
          seen
        } = messageData;

        console.log(event);

        if (event == "send"){
          console.log("sending")
          if (chatOption && text) {
            console.log("starting");
            // All messages sent get stored in the user's messages context. This line sends the message back to the sender and receiver.
            //This is not for specific chat rooms. The messageLog does filtering for that.
            const availableAndSpecifiedClients = [...wss.clients].filter(
              (client) => client.userId == buyer || client.userId == seller
            );
  
            let receiverFound = false;
            for (const client of availableAndSpecifiedClients) {
              if (client.userId === receiver) {
                receiverFound = true;
                break;
              }
            }
  
            // Need to do testing here.
            // It is expectedly true or false when someone is not connected but just because they are connected 
            // doesn't mean that they have seen the message since they are different chat logs (options)
            console.log(receiverFound);
            // if (receiverFound) {
            //   // Receiver is available
            //   availableAndSpecifiedClients.forEach((client) =>
            //   client.send(
            //     JSON.stringify({
            //       chatOption,
            //       buyer,
            //       seller,
            //       sender,
            //       senderType,
            //       receiver,
            //       receiverType,
            //       text,
            //       date_now_exclusion,
            //       seen: true
  
            //     })
            //   )
            // );
              
            // } else {
              // Receiver is not available
              availableAndSpecifiedClients.forEach((client) =>
              client.send(
                JSON.stringify({
                  event,
                  chatOption,
                  buyer,
                  seller,
                  sender,
                  senderType,
                  receiver,
                  receiverType,
                  text,
                  date_now_exclusion,
                  seen,
  
                })
              )
            );
            // }
  
            // Testing purposes
            [...wss.clients]
              .filter(
                (client) => client.userId == buyer || client.userId == seller
              )
              .forEach((client) => console.log(client.userId));
          }
        }
        if (event == "edit") {
          console.log("editing");
          const availableAndSpecifiedClients = [...wss.clients].filter(
            (client) => client.userId == buyer || client.userId == seller
          );

          availableAndSpecifiedClients.forEach((client) =>
              client.send(
                JSON.stringify({
                  event,
                  chatOption,
                  buyer,
                  seller,
                  sender,
                  senderType,
                  receiver,
                  receiverType,
                  text,
                  date_now_exclusion,
                  seen,
  
                })
              )
            );


        }
        console.log(messageData);

        
      });

      // connection.on("handleTest", (message) => {
      //   console.log("deleing")
      // });
    });








    
    console.log("disconnected");
  })
  .catch((error) => {
    console.log(error);
  });
