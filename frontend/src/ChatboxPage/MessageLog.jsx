import { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../UserContext";
import { ChatboxContext } from "./ChatboxContext";
import Message from "./Message";

import { uniqBy } from "lodash";

export default function MessageLog() {
  //Context change triggers re-render!
  const {
    chatOption,
    messages,
    setMessages,
    buyerInOption,
    sellerInOption,
    processingNewMessages,
    setProcessingNewMessages,
    
  } = useContext(ChatboxContext);

  const { username, id, setNotifications, setChangeTest} = useContext(UserContext);

  const [loading, setLoading] = useState(true);

  const [ready, setReady] = useState(false);

  const divUnderMessages = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(
        `http://localhost:4040/chat/message/${chatOption}`
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
            seen: message.seen
          }));
          return [...prev, ...newMessages];
        });
        console.log(json, "jsonnnn");
        setLoading(false);
        setProcessingNewMessages(true);
      }
    };

    if (chatOption) {
      fetchMessages();
      console.log(messages);
    }
  }, [chatOption]);

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {

    if (processingNewMessages){
      console.log(messages, "inside of effect hook");
      const promises = messages.map((message) => {
        if (id == message.receiver) {
          if (message._id) {
            return fetch(`http://localhost:4040/chat/message/${message._id}`, {
              // Assuming endpoint supports individual message updates
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                // Add authorization headers if needed
              },
              body: JSON.stringify({
                // PATCH request data specific to this message
                seen: true,
              }),
            });
          }
        }
      });
      //make new fetch to notifications. Possible solution. Update messages to seen and then refetch notifications.
      setChangeTest("test");
      // setNotifications(
      //     messages.filter(
      //       (message) => message.sender == id && message.seen == false && message.chatOption == chatOption
      //     )
      //   );
      console.log(promises);
    }
   

    
  }, [processingNewMessages]);

  console.log(processingNewMessages, "what processingNewMessages is");

  console.log(messages, "messages");

  // Currently necessary for messages coming through the websocket because thats where duplication
  // is taking place. Gave each document an exlusion date so that this next code wouldn't break the fetch.
  const uniqueMessages = uniqBy(messages, "date_now_exclusion");

  console.log(uniqueMessages, " unique messages");

  const filteredMessages = uniqueMessages.filter(
    (message) => message.chatOption === chatOption
  );

  return (
    <>
      <h1>Message Log</h1>
      {chatOption ? (
        <>
          {loading ? (
            <p>Loading messages...</p>
          ) : (
            <>
              {filteredMessages.map((message, index) => (
                <Message key={index} messageData={message} />
              ))}
              <div ref={divUnderMessages}></div>
            </>
          )}
        </>
      ) : (
        <p>Select a conversation</p>
      )}
    </>
  );
}
