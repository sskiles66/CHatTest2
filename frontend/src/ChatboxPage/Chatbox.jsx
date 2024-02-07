
import ChatOptions from "./ChatOptions";
import MessageLog from "./MessageLog";
import MessageSender from "./MessageSender";

import { useContext } from "react";
import { UserContext } from "../UserContext";

import { ChatboxContextProvider } from "./ChatboxContext";

import Container from "./Container";

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
            <Container />
            </ChatboxContextProvider>
            
        </>
    )
}