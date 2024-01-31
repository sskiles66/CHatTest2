
import ChatOptions from "./ChatOptions";
import MessageLog from "./MessageLog";
import MessageSender from "./MessageSender";

import { useContext } from "react";
import { UserContext } from "../UserContext";

import { ChatboxContextProvider } from "./ChatboxContext";

import "./styles/ChatStyles.css";

// Chatbox container for main components. There is also a chatbox context for specific data in the chatbox.
// ChatOptions > Options
// MessageLog > Message
// MessageSender


export default function Chatbox() {
    

    const {username, id} = useContext(UserContext);

    return (
        <>

            <ChatboxContextProvider>
            {username ? <div id="chat-cont">
                <div id="chat-options">
                    <ChatOptions />
                </div>
                <div id="message-log">
                    <MessageLog />
                </div>
                <div id="message-sender">
                    <MessageSender />
                </div>
            </div> : <p>Please login</p>}
            </ChatboxContextProvider>
            
        </>
    )
}