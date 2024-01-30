
import ChatOptions from "./ChatOptions";
import MessageLog from "./MessageLog";
import MessageSender from "./MessageSender";

import { useContext } from "react";
import { UserContext } from "../UserContext";

import { ChatboxContextProvider } from "./ChatboxContext";

// import { Redirect } from "react-router-dom";

import "./styles/ChatStyles.css";


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