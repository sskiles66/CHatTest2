import { useEffect, useContext, useState } from "react";
import { UserContext } from "../UserContext";
import Option from "./Option";
import { ChatboxContext } from "./ChatboxContext";

export default function ChatOptions() {
  const { id, notifications} = useContext(UserContext);

  const {
    setChatOption,
    setBuyerInOption,
    setSellerInOption,
    messages,
    setMessages,
    processingNewMessages,
    setProcessingNewMessages,
    chatOptions,
    setChatOptions

  } = useContext(ChatboxContext);

  // OnMount, chatOptions are fetched and then set.

  useEffect(() => {
    const fetchOptions = async () => {
      const response = await fetch(
        `http://localhost:4040/subscription/get/${id}`
      );
      const json = await response.json();

      console.log(json, "OPTIONS");

      if (response.ok) {
        setChatOptions(json);
      }
    };
    

    fetchOptions();
    
  }, []);

  // console.log(chatOptions, "chatOptions");

  // Map through each option to make them components with props as data.
  // Notifications are set in the navbar component and are filtered based upon the sub_id.
  // When an option is clicked, some data is set in the chatbox context.

  return (
    <>
      <h1>Chat Options</h1>
      {chatOptions ? (
        chatOptions.map((option) => (
          <Option
            key={option._id}
            data={option}
            notifications={notifications.filter(notification => notification.subscription_id == option._id)}
            onClick={() => {
              setChatOption(option._id);
              setBuyerInOption(option.buyer_id);
              setSellerInOption(option.seller_id);
              setMessages([]);
              setProcessingNewMessages(false);
            }}
          />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
