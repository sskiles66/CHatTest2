import { useEffect, useState, useContext } from "react"
import { UserContext } from "./UserContext";
import { ChatboxContext } from "./ChatboxPage/ChatboxContext";
import { uniqBy } from "lodash";

export default function Navbar(){

    

    const {id, notifications, setNotifications, rerender, setRerender} = useContext(UserContext);
    const {messages} = useContext(ChatboxContext);

    // When id exists, fetch unseen messages from db. Recalls when rerender changes.
    // Having notifications in dependancy array make it so everything rerenders constantly.

    useEffect(() => {
        const fetchUnseenMessages = async () => {

            const response = await fetch(`http://localhost:4040/chat/message/notif/${id}`);
            const json = await response.json();

            console.log(json, "notifcation")

            if (response.ok){
                setNotifications(json);
                
            }
        }

        if (id){
            fetchUnseenMessages();
            // setRerender("");
        }
        
        // had notifications in dependency array but I believe this was making everything re-render maybe?
    }, [id]);


    // useEffect(() => {
    //     setNotifications(notifications);
    // }, [notifications])

    const uniqueNotifs = uniqBy(notifications, "date_now_exclusion");


    // console.log(notifications, "notititit")
    return (
        <>
            <p>Navbar</p>
            {notifications ? (<p>{uniqueNotifs.length}</p>) : 0}
            <button onClick={() => setRerender("render")}>Refresh</button>
            
        </>
    )
}