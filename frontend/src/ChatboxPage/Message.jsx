import { useEffect, useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { ChatboxContext } from "./ChatboxContext";

export default function Message(props) {
  const { id } = useContext(UserContext);

  const { chatOption, buyerInOption, sellerInOption, setMessages } =
    useContext(ChatboxContext);

  const [editToggle, setEditToggle] = useState(false);

  const [messageText, setMessageText] = useState(props.messageData.text);

  const [isDeleted, setIsDeleted] = useState(false);

//   console.log(props, "message props");

  let role;

  let clarification;

  let date;

  // Based upon the props, render specific data on who sent and received a message with text.

  if (id == props.messageData.sender) {
    role = "sender";
    if (id == buyerInOption) {
      clarification = `You (buyer) ${buyerInOption} sent to (seller) ${sellerInOption}:`;
    } else {
      clarification = `You (seller) ${sellerInOption} sent to (buyer) ${buyerInOption}:`;
    }
  }
  if (id == props.messageData.receiver) {
    role = "receiver";
    if (id == buyerInOption) {
      clarification = `You (buyer) ${buyerInOption} received from (seller) ${sellerInOption}:`;
    } else {
      clarification = `You (seller) ${sellerInOption} received from (buyer) ${buyerInOption}:`;
    }
  }

  function toggleEdit() {
    setEditToggle(!editToggle);
  }

  function getDate(timestamp) {
    // Create a Date object from the timestamp
    const date = new Date(timestamp);

    // Extract month, day, and time components
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    // const seconds = date.getSeconds().toString().padStart(2, "0");

    // Format the output
    const formattedDate = `${month}/${day} ${hours}:${minutes}`;

    // console.log(formattedDate); // Output: 2/1 16:47:43

    return formattedDate
  }

  date = getDate(props.messageData.date_now_exclusion);

  function editMessage(e) {
    e.preventDefault();
    // console.log(messageText);
    fetch(`http://localhost:4040/chat/message/edit/${props.messageData._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: messageText,
      }),
    });
    setEditToggle(false);
  }

  function deleteMessage(e) {
    e.preventDefault();
    // console.log(props.messageData._id, "_ididid");

    fetch(
      `http://localhost:4040/chat/message/delete/${props.messageData._id}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        // console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });

    setIsDeleted(true);
  }

  return (
    <>
      {!isDeleted ? ( // Conditionally render based on isDeleted state
        <div className={role}>
          <div id={role}>
            <p>{clarification}</p>
            {editToggle ? (
              <form onSubmit={editMessage}>
                <input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  type="text"
                  required
                />
                <button type="submit">Edit</button>
              </form>
            ) : (
              <p>{messageText}</p>
            )}

            {date ? <p>{date}</p> : ""}

            {props.isLast &&
            props.messageData.sender == id &&
            props.messageData._id ? (
              <div>
                <button onClick={toggleEdit}>
                  {editToggle ? "Stop Editing" : "Edit"}
                </button>
                <button onClick={deleteMessage}>Delete</button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
