import { useEffect, useContext, useState } from "react";
import { UserContext } from "../UserContext";

import { ChatboxContext } from "./ChatboxContext"; 

export default function Option(props) {
    

    const {chatOption} = useContext(ChatboxContext);

    console.log(props, "props");

    const {username, id} = useContext(UserContext);

    const yourId = id;
    const buyerId = props.data.buyer_id;
    const sellerId = props.data.seller_id;

    const sub = props.data.subscription;

    let statement = "";

    if (yourId == buyerId){
        statement = `You (buyer): ${yourId} Seller: ${sellerId}`
    }else{
        statement = `You (seller): ${yourId} Buyer: ${buyerId}`
    }

    return (
        <>
            <div id={props.data._id === chatOption ? "active" : ""} className="chat-option" onClick={props.onClick}>
                <p>_id: {props.data._id} {statement} {sub}</p>
                <p>Notifications: {props.notifications.length}</p>
            </div>
        </>
    )
}