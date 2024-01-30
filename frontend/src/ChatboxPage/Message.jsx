import { useEffect, useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { ChatboxContext } from "./ChatboxContext";

export default function Message(props) {

    const {username, id} = useContext(UserContext);

    const { chatOption, buyerInOption, sellerInOption, setMessages } = useContext(ChatboxContext);

    // console.log(props, "message props");

    let role;

    let clarification;

    if (id == props.messageData.sender) {
        role = "sender";
        if (id == buyerInOption){
            clarification = `You (buyer) ${buyerInOption} sent to (seller) ${sellerInOption}:` 
        }else{
            clarification = `You (seller) ${sellerInOption} sent to (buyer) ${buyerInOption}:` 
        }
    }
    if (id == props.messageData.receiver) {
        role = "receiver";
        if (id == buyerInOption){
            clarification = `You (buyer) ${buyerInOption} received from (seller) ${sellerInOption}:` 
        }else{
            clarification = `You (seller) ${sellerInOption} received from (buyer) ${buyerInOption}:` 
        }
    }

    return (
        <>
        <div className={role}>
            <div id={role}>
                <p>{clarification}</p>
                <p>{props.messageData.text}</p>
            </div>
        </div> 
        </>
    )
}