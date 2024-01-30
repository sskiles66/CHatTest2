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
    setMessages,
    chatOptions,
    setChatOptions,
  } = useContext(ChatboxContext);

  let errorMessages = [];

  let realSender;
  let realSenderType;

  let realReceiver;
  let realReceiverType;

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

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4040");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);

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

    setNotifications(
      prev,
      messages.filter(
        (message) => message.sender == id && message.seen == false
      )
    );
  }

  //   const handleMessage = debounce((e) => {
  //     const messageData = JSON.parse(e.data);
  //     console.log(messageData, "messageData");
  //     // Miss isOur false for now 2:49
  //     setMessages((prev) => [...prev, { chatOption: messageData.chatOption, buyer: messageData.buyer, seller: messageData.seller, sender: messageData.sender, senderType: messageData.senderType, receiver: messageData.receiver, receiverType: messageData.receiverType, text: messageData.text }]);
  //   }, 250);

  //   window.addEventListener('resize', handleMessage);

  function sendMessage(e) {
    e.preventDefault();

    // if (broadcast) {
    //   chatOptions.forEach((element) => {
    //     fetch("http://localhost:4040/chat/message", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         subscription_id: element._id,
    //         buyer: element.buyer_id,
    //         seller: element.seller_id,
    //         sender: realSender,
    //         senderType: realSenderType,
    //         receiver: realReceiver,
    //         receiverType: realReceiverType,
    //         text: messageText,
    //         date_now_exclusion: Date.now(),
    //         seen: false,
    //       }),
    //     })
    //       .then((response) => response.json())
    //       .then((data) => {
    //         console.log("Success:", data);
    //         // setMessages((prev) => [...prev, { text: messageText, subscription_id: chatOption, sender: realSender, senderType: realSenderType, receiver: realReceiver, receiverType: realReceiverType, date: Date.now() }]);
    //       })
    //       .catch((error) => {
    //         errorMessages.push(error);
    //         console.error("Error:", error);
    //       });

    //     try {
    //       ws.send(
    //         JSON.stringify({
    //           chatOption: element._id,
    //           buyer: element.buyer_id,
    //           seller: element.seller_id,
    //           sender: realSender,
    //           senderType: realSenderType,
    //           receiver: realReceiver,
    //           receiverType: realReceiverType,
    //           text: messageText,
    //           date_now_exclusion: Date.now(),
    //           seen: false,
    //         })
    //       );
    //     } catch (error) {
    //       errorMessages.push(error);
    //       console.error("Error:", error);
    //     }
    //   });
    // } else {
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
    // }

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
