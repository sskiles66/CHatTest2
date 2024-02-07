
import ChatOptions from "./ChatOptions";
import MessageLog from "./MessageLog";
import MessageSender from "./MessageSender";

import { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";

import { ChatboxContextProvider } from "./ChatboxContext";

import "./styles/ChatStyles.css";

import { io } from "socket.io-client";

// Chatbox container for main components. There is also a chatbox context for specific data in the chatbox.
// ChatOptions > Options
// MessageLog > Message
// MessageSender


export default function Container() {
    

    const {username, id} = useContext(UserContext);

    // const [socket, setSocket] = useState();

    

    return (
        <>

            
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
            
            
        </>
    )
}