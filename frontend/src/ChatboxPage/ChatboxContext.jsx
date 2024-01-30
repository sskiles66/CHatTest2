import { createContext, useState, useEffect } from "react";
// import axios from "axios";

export const ChatboxContext = createContext({});

export function ChatboxContextProvider({ children }) {
  const [chatOption, setChatOption] = useState(null);

  const [buyerInOption, setBuyerInOption] = useState(null);

  const [sellerInOption, setSellerInOption] = useState(null);

  const [messages, setMessages] = useState([]);

  const [processingNewMessages, setProcessingNewMessages] = useState(false);

  
  

  return (
    <ChatboxContext.Provider
      value={{
        chatOption,
        setChatOption,
        buyerInOption,
        setBuyerInOption,
        sellerInOption,
        setSellerInOption,
        messages,
        setMessages,
        processingNewMessages,
        setProcessingNewMessages,

      }}
    >
      {children}
    </ChatboxContext.Provider>
  );
}
