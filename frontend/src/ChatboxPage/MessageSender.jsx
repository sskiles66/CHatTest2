import { useEffect, useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { ChatboxContext } from "./ChatboxContext";
import { v4 as uuidv4 } from "uuid";
import debounce from "lodash/debounce";

export default function MessageSender() {
  const { username, id, setNotifications } = useContext(UserContext);

  const [messageText, setMessageText] = useState("");

  const [ws, setWs] = useState(null);

  const [broadcast, setBroadcast] = useState(false);

  const {
    chatOption,
    buyerInOption,
    sellerInOption,
    messages,
    setMessages,
    chatOptions,
    setChatOptions,
  } = useContext(ChatboxContext);

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

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4040");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);


  // This is the function that is called when a message is sent from the server to the client.
  // It sets messages to build upon the previous messages that have already been fetched from the db.
  // Have ran into issues with rerendering notification here.
  function handleMessage(e) {
    const messageData = JSON.parse(e.data);
    console.log(messageData, "messageData");

    setMessages((prev) => [
      ...prev,
      {
        chatOption: messageData.chatOption,
        buyer: messageData.buyer,
        seller: messageData.seller,
        sender: messageData.sender,
        senderType: messageData.senderType,
        receiver: messageData.receiver,
        receiverType: messageData.receiverType,
        text: messageData.text,
        date_now_exclusion: messageData.date_now_exclusion,
        seen: messageData.seen,
      },
    ]);

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
    
  }


  // This function currently references a broadcast state so that if it is true,
  // it sends the messages to all of the user's chatOptions
  function sendMessage(e) {
    e.preventDefault();
    //Currently a bug with broadcasting
    if (broadcast) {

      //There is a problem with this because of my set-up. I currently can't have more than two subscribers
      // to the same subscription and this would require me to build things up again so I am trusting
      // that during the implementation process there is a way to do this.
      // There are already issues that exist with this as well with updating messages and whatnot.
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

      // Ws sending message to server
      try {
        ws.send(
          JSON.stringify({
            chatOption: chatOption,
            buyer: buyerInOption,
            seller: sellerInOption,
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
    }

    setMessageText("");
    
  }

  function toggleBroadcast(){
    setBroadcast(!broadcast);
  }

  return (
    <>
      <h1>Message Sender</h1>
      {chatOption ? (
        <form onSubmit={sendMessage}>
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
      <button onClick={toggleBroadcast}>{!broadcast ? "Single Message" : "Broadcast"}</button>
    </>
  );
}
