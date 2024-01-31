import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext({});

// Supplies context to the rest of the application. 
// Username and id comes from the jwt, the /profile route leads
// to a function in the backend that gets the data from the user's cookie.
// Notifications are set and read in the navbar component
// Problems with notifications are in the Navbar and MessageSender.
// reRender is for refetching notifications in the navbar when a message log is renders
// (messages are updated as read there)


export function UserContextProvider({ children }) {
  const [username, setLoggedInUsername] = useState(null);
  const [id, setId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [rerender, setRerender] = useState("");
  useEffect(() => {
    axios.get("/profile").then((response) => {
      setId(response.data.userId);
      setLoggedInUsername(response.data.username);
    });
  }, []);
  return (
    <UserContext.Provider
      value={{
        username,
        setLoggedInUsername,
        id,
        setId,
        notifications,
        setNotifications,
        rerender,
        setRerender
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
