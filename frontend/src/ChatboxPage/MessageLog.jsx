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

  const { id, setNotifications, setRerender} = useContext(UserContext);

  // To make sure that the rendering of this component waits until the messages are ready.
  const [loading, setLoading] = useState(true);

  // This is for autoscrolling
  const divUnderMessages = useRef();

  // Fetched past messages and sets the messages.
  // Loading is set to false meaning that they are done loading.
  // WHen done, processingNewMessages is set to true meaning the other
  // Effect hook can be called so that these messages can be patched to be seen
  // This hook calls everytime messages changes and when chatOption exists.

  useEffect(() => {
    const fetchMessages = async () => {
      console.log(id);
      const response = await fetch(
        // Had to add id so there is extra filtering happening when fetching messages
        // for when we have multiple people subscribed to the same item
        `http://localhost:4040/chat/message/${chatOption}/spec/${id}`
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

    if (chatOption && id) {
      fetchMessages();
      console.log(messages);
    }
  }, [chatOption]);
//xs

  // This hook makes it so that messages are autoscrolled everytime messages change.
  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);


  // When processingNewMessages are true, every message for the receiver and that has an _id,
  // I patch every message to be seen (this is definently not efficient) and rerender is changed 
  // so that notifications are refetched in the navbar. This happens whenever processingNewMessages changes.
  useEffect(() => {

    if (processingNewMessages){
      console.log(messages, "inside of effect hook");
      const promises = messages.map((message) => {
        if (id == message.receiver) {
          if (message._id) {
            return fetch(`http://localhost:4040/chat/message/${message._id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                seen: true,
              }),
            });
          }
        }
      });
      //make new fetch to notifications. Possible solution. Update messages to seen and then refetch notifications.
      setRerender("render");
      // setNotifications(
      //     messages.filter(
      //       (message) => message.sender == id && message.seen == false && message.chatOption == chatOption
      //     )
      //   );
      // console.log(promises);
    }
   

    
  }, [processingNewMessages]);

  // console.log(processingNewMessages, "what processingNewMessages is");

  // console.log(messages, "messages");

  // Currently necessary for messages coming through the websocket because thats where duplication
  // is taking place. Gave each document an exlusion date so that this next code wouldn't break the fetch.

  //WHen messages are sent through the websocket, they are duplicates so this lodash method 
  // gets rid of the duplicates based upon the date that they were created. 
  const uniqueMessages = uniqBy(messages, "date_now_exclusion");

  // console.log(uniqueMessages, " unique messages");

  // Filtering messages by chatOption so you see messages only for that chatOption or log.
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
                <Message key={index} messageData={message} isLast={index === filteredMessages.length - 1}/>
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
