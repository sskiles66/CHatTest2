import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setLoggedInUsername] = useState(null);
  const [id, setId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [changeTest, setChangeTest] = useState("");
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
        changeTest,
        setChangeTest
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
