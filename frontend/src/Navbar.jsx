import { useEffect, useState, useContext } from "react"
import { UserContext } from "./UserContext";

export default function Navbar(){

    

    const {username, id, notifications, setNotifications} = useContext(UserContext);

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
        }
        
        // had notifications in dependency array but I believe this was making everything re-render maybe?
    }, [id]);


    // useEffect(() => {
    //     setNotifications(notifications);
    // }, [notifications])


console.log(notifications, "notititit")
    return (
        <>
            <p>Navbar</p>
            {notifications ? (<p>{notifications.length}</p>) : 0}
            
        </>
    )
}