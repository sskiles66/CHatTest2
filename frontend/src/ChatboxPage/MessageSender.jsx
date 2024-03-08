import { useEffect, useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { ChatboxContext } from "./ChatboxContext";
import { v4 as uuidv4 } from "uuid";
import debounce from "lodash/debounce";
import { io } from "socket.io-client";

export default function MessageSender() {
  const { username, id, setNotifications } = useContext(UserContext);

  const {
    chatOption,
    buyerInOption,
    sellerInOption,
    messages,
    setMessages,
    chatOptions,
    setChatOptions,
  } = useContext(ChatboxContext);

  const [messageText, setMessageText] = useState("");

  const [ws, setWs] = useState(null);

  const [broadcast, setBroadcast] = useState(false);
  const socket = io("http://localhost:3000");
  socket.on("connect", () => {
    console.log("connected");
  });

  //The join method is not directly available 
  // on the socket object in socket.io-client. 
  // Instead, you need to emit a custom event to the server requesting to join a room.

  // Emit an event requesting to join the room
  socket.emit("join-room", chatOption);

  // Listen for confirmation from the server
  socket.on("join-room-confirmation", (data) => {
    if (data.success) {
      // Successfully joined the room
      console.log("Joined room:", chatOption);
    } else {
      // handle error message (e.g., invalid chatOption)
    }
  });

  socket.on("handle-message", (message) => {
    console.log(message, "INCOMING");
    const newMessage = JSON.parse(message);

    setMessages((prev) => [
      ...prev,
      {
        chatOption: newMessage.subscription_id,
        buyer: newMessage.buyer,
        seller: newMessage.seller,
        sender: newMessage.sender,
        senderType: newMessage.senderType,
        receiver: newMessage.receiver,
        receiverType: newMessage.receiverType,
        text: newMessage.text,
        date_now_exclusion: newMessage.date_now_exclusion,
        seen: newMessage.seen,
      },
    ]);
  });

  let errorMessages = [];

  let realSender;
  let realSenderType;

  let realReceiver;
  let realReceiverType;

  // Clarifications for data output on who is who

  if (id == buyerInOption) {
    realSender = buyerInOption;
    realSenderType = "Buyer";
    realReceiver = sellerInOption;
    realReceiverType = "Seller";
  }

  if (id == sellerInOption) {
    realSender = sellerInOption;
    realSenderType = "Seller";
    realReceiver = buyerInOption;
    realReceiverType = "Buyer";
  }

  // On mount, the ws is set-up and it listens for messages from the server.

  // useEffect(() => {
  //   const ws = new WebSocket("ws://localhost:4040");
  //   setWs(ws);
  //   ws.addEventListener("message", handleMessage);
  // }, []);

  // This is the function that is called when a message is sent from the server to the client.
  // It sets messages to build upon the previous messages that have already been fetched from the db.
  // Have ran into issues with rerendering notification here.
  // function handleMessage(e) {
  //   const messageData = JSON.parse(e.data);
  //   console.log(messageData, "messageData");

  //   setMessages((prev) => [
  //     ...prev,
  //     {
  //       chatOption: messageData.chatOption,
  //       buyer: messageData.buyer,
  //       seller: messageData.seller,
  //       sender: messageData.sender,
  //       senderType: messageData.senderType,
  //       receiver: messageData.receiver,
  //       receiverType: messageData.receiverType,
  //       text: messageData.text,
  //       date_now_exclusion: messageData.date_now_exclusion,
  //       seen: messageData.seen,
  //     },
  //   ]);

  //This wasn't running since the effect hook that refetches data in Navbar isn't being rerun.

  // if (messages){
  //   console.log(messages, "messages!!!");
  //   setNotifications((prev) =>
  //   prev,
  //   messages.filter(
  //     (message) => message.receiver == id && message.seen == false
  //   )
  // );
  // }

  // setNotifications(messageData);

  // }

  async function sendAndFetchMessages(e) {
    e.preventDefault();
    try {
      // Post new message to db (first request)
      const postResponse = await fetch("http://localhost:4040/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // ... message data
          subscription_id: chatOption,
          buyer: buyerInOption,
          seller: sellerInOption,
          sender: realSender,
          senderType: realSenderType,
          receiver: realReceiver,
          receiverType: realReceiverType,
          text: messageText,
          date_now_exclusion: Date.now(),
          seen: false,
        }),
      });

      if (postResponse.ok) {
        const postData = await postResponse.json();
        console.log("Success:", postData);
      } else {
        throw new Error("Error posting message");
      }

      socket.emit(
        "send-message",
        JSON.stringify({
          // ... message data
          subscription_id: chatOption,
          buyer: buyerInOption,
          seller: sellerInOption,
          sender: realSender,
          senderType: realSenderType,
          receiver: realReceiver,
          receiverType: realReceiverType,
          text: messageText,
          date_now_exclusion: Date.now(),
          seen: false,
        }),
        chatOption
      );

      // // Fetch messages after successful POST (second request)
      // const getResponse = await fetch(
      //   `http://localhost:4040/chat/message/${chatOption}/all/${id}`
      // );

      // if (getResponse.ok) {
      //   const json = await getResponse.json();
      //   console.log(json, "jsonnnn");
      //   setMessages((prev) => {
      //     const newMessages = json.map((message) => ({
      //       _id: message._id,
      //       chatOption: message.subscription_id,
      //       buyer: buyerInOption,
      //       seller: sellerInOption,
      //       sender: message.sender,
      //       senderType: message.senderType,
      //       receiver: message.receiver,
      //       receiverType: message.receiverType,
      //       text: message.text,
      //       date_now_exclusion: message.date_now_exclusion,
      //       seen: message.seen
      //     }));
      //     return [...prev, ...newMessages];
      //   });
      // } else {
      //   throw new Error("Error fetching messages");
      // }
    } catch (error) {
      errorMessages.push(error);
      console.error("Error:", error);
    }

    setMessageText("");
  }

  // This function currently references a broadcast state so that if it is true,
  // it sends the messages to all of the user's chatOptions
  async function sendMessage2(e) {
    e.preventDefault();
    //Currently a bug with broadcasting

    //There is a problem with this because of my set-up. I currently can't have more than two subscribers
    // to the same subscription and this would require me to build things up again so I am trusting
    // that during the implementation process there is a way to do this.
    // There are already issues that exist with this as well with updating messages and whatnot.
    if (broadcast) {
      chatOptions.forEach((element) => {
        fetch("http://localhost:4040/chat/message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subscription_id: element._id,
            buyer: element.buyer_id,
            seller: element.seller_id,
            sender: realSender,
            senderType: realSenderType,
            receiver: realReceiver,
            receiverType: realReceiverType,
            text: messageText,
            date_now_exclusion: Date.now(),
            seen: false,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            // setMessages((prev) => [...prev, { text: messageText, subscription_id: chatOption, sender: realSender, senderType: realSenderType, receiver: realReceiver, receiverType: realReceiverType, date: Date.now() }]);
          })
          .catch((error) => {
            errorMessages.push(error);
            console.error("Error:", error);
          });

        try {
          ws.send(
            JSON.stringify({
              chatOption: element._id,
              buyer: element.buyer_id,
              seller: element.seller_id,
              sender: realSender,
              senderType: realSenderType,
              receiver: realReceiver,
              receiverType: realReceiverType,
              text: messageText,
              date_now_exclusion: Date.now(),
              seen: false,
            })
          );
        } catch (error) {
          errorMessages.push(error);
          console.error("Error:", error);
        }
      });
    } else {
      //Post new message to db.
      fetch("http://localhost:4040/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription_id: chatOption,
          buyer: buyerInOption,
          seller: sellerInOption,
          sender: realSender,
          senderType: realSenderType,
          receiver: realReceiver,
          receiverType: realReceiverType,
          text: messageText,
          date_now_exclusion: Date.now(),
          seen: false,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          // setMessages((prev) => [...prev, { text: messageText, subscription_id: chatOption, sender: realSender, senderType: realSenderType, receiver: realReceiver, receiverType: realReceiverType, date: Date.now() }]);
        })
        .catch((error) => {
          errorMessages.push(error);
          console.error("Error:", error);
        });

      const response = await fetch(
        // Had to add id so there is extra filtering happening when fetching messages
        // for when we have multiple people subscribed to the same item
        `http://localhost:4040/chat/message/${chatOption}/all/${id}`
      );

      console.log(response, "resposne");
      const json = await response.json();

      if (response.ok) {
        setMessages((prev) => {
          const newMessages = json.map((message) => ({
            _id: message._id,
            chatOption: message.subscription_id,
            buyer: buyerInOption,
            seller: sellerInOption,
            sender: message.sender,
            senderType: message.senderType,
            receiver: message.receiver,
            receiverType: message.receiverType,
            text: message.text,
            date_now_exclusion: message.date_now_exclusion,
            seen: message.seen,
          }));
          return [...prev, ...newMessages];
        });
        console.log(json, "jsonnnn");gdgdgd
        // setLoading(false);
        // setProcessingNewMessages(true);
      }

      // Ws sending message to server
      // try {
      //   ws.send(
      //     JSON.stringify({
      //       chatOption: chatOption,
      //       buyer: buyerInOption,
      //       seller: sellerInOption,
      //       sender: realSender,
      //       senderType: realSenderType,
      //       receiver: realReceiver,
      //       receiverType: realReceiverType,
      //       text: messageText,
      //       date_now_exclusion: Date.now(),
      //       seen: false,
      //     })
      //   );
      // } catch (error) {
      //   errorMessages.push(error);
      //   console.error("Error:", error);
      // }
    }

    setMessageText("");
  }

  // function toggleBroadcast(){
  //   setBroadcast(!broadcast);
  // }

  return (
    <>
      <h1>Message Sender</h1>
      {chatOption ? (
        <form onSubmit={sendAndFetchMessages}>
          <input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            type="text"
            required
          ></input>
          <button type="submit">Send</button>
        </form>
      ) : (
        <p>Select a conversation</p>
      )}
      {errorMessages ? (
        <ul>
          {errorMessages.map((errMessage) => (
            <li>{errMessage}</li>
          ))}
        </ul>
      ) : (
        ""
      )}
      {/* <button onClick={toggleBroadcast}>{!broadcast ? "Single Message" : "Broadcast"}</button> */}
    </>
  );
}
