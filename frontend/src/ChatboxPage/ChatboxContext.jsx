import { update } from "lodash";
import { createContext, useState, useEffect } from "react";
// import axios from "axios";

export const ChatboxContext = createContext({});

// Supplies context data for children components. 
// chatOption is the currently selected chatOption.
// chatOptions are all of the possible chatOptions.
// When a chatOption is clicked buyerInOption and sellerInOption get set.
// messages are used in two places. They are first set in the messageLog to
// get the history of messages and then when a message is handled via the WebSocket, 
// those messages are set.
// processingNewMessages is in messageLog. First, when the history messages are fetched,
// processingNewMessages is set to true to that a second useEffect hook is called to update
// those messages as seen messages. This could potentially just be a state in the 
// messageLog Component.



export function ChatboxContextProvider({ children }) {

  const [chatOption, setChatOption] = useState(null);

  const [chatOptions, setChatOptions] = useState();

  const [buyerInOption, setBuyerInOption] = useState(null);

  const [sellerInOption, setSellerInOption] = useState(null);

  const [messages, setMessages] = useState([]);

  const [processingNewMessages, setProcessingNewMessages] = useState(false);

  const [socket, setSocket] = useState(null);

  // useEffect(() => {
  //   connectSocket().then((connectedSocket) => setSocket(connectedSocket));
  // }, []);

  
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
        chatOptions,
        setChatOptions,
        socket
      }}
    >
      {children}
    </ChatboxContext.Provider>
  );
}
