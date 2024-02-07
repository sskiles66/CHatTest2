import ChatOptions from "./ChatOptions";
import MessageLog from "./MessageLog";
import MessageSender from "./MessageSender";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";

import { ChatboxContext } from "./ChatboxContext";

import { ChatboxContextProvider } from "./ChatboxContext";

import "./styles/ChatStyles.css";

// Chatbox container for main components. There is also a chatbox context for specific data in the chatbox.
// ChatOptions > Options
// MessageLog > Message
// MessageSender

export default function Chatbox() {
  const { username, id, setWs } = useContext(UserContext);

  const { messages, setMessages } = useContext(ChatboxContext);

  const [onDelete, setOnDelete] = useState(false);

  const [messagetoDelete, setMessageToDelete] = useState();

  function handleTest() {
    console.log("tetsts");
  }

  function handleMessage(e) {
    const messageData = JSON.parse(e.data);
    console.log(messageData, "messageDataffdhdhfdhfhd");

    if (messageData.event == "send") {
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
    }

    if (messageData.event == "edit") {
      console.log("wuwuwuwu");
      setMessageToDelete(messageData);
      console.log(messageData, "1");
      console.log(messages);
      setOnDelete(true);
    }
  }
  console.log(messages);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4040");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("test", handleTest);
  }, []);

  useEffect(() => {
    if (onDelete && messagetoDelete) {
        console.log(messages);
        // setMessages(messages.filter((message) => {
        //     message.text == "fds";
        // }))
        setMessages(messages.slice(0, -1));

        console.log(messages, "WTF")
    }
  }, [onDelete])

  return (
    <>
      {username ? (
        <div id="chat-cont">
          <div id="chat-options">
            <ChatOptions />
          </div>
          <div id="message-log">
            <MessageLog />
          </div>
          <div id="message-sender">
            <MessageSender />
          </div>
        </div>
      ) : (
        <p>Please login</p>
      )}
    </>
  );
}
