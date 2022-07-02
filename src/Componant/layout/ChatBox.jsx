import React, { useState, useContext } from "react";
import { useEffect } from "react";
import { SocketContext } from "../../contextApi/Contexts/socket";
import { AppContext } from "../../contextApi/Contexts/AppContext";
const ChatBox = () => {
  const [isOpen, openChat] = useState(false);
  const [messages, addMessageToChat] = useState([]);
  const [ChatMessage, setChatMessage] = useState(null);

  const Socket = useContext(SocketContext);

  const { roomState } = useContext(AppContext);

  const { roomName } = roomState;

  /*
  send a Privet message to user
  check if the input is empty and add it 
  to HistoryChat savet to the state empty the 
  chat box and send it to the server
  */

  /*   const SendPrivetMessage = (e) => {
    e.preventDefault();
    if (PrivetMessage.trim() === "") return;

    addMessageToChat(<div className=" messageitem ">{PrivetMessage}</div>);

    addPrivetMessage("");
    Socket.emit(
      "SendPrivetMessage",
      { id: e.target.id, Message: PrivetMessage },
      (room) => {
        console.log(room);
      }
    );
  }; */

  /*
  send message to public chat board
  check if the input is empty and add it 
  to HistoryChat savet to the state empty the 
  chat box and send it to the server
  */
  const SendMessageChat = (e) => {
    e.preventDefault();
    if (ChatMessage.trim() === "") return;
    const messagelist = [...messages];
    messagelist.push(<div className=" messageitem ">{ChatMessage}</div>);
    addMessageToChat(messagelist);

    setChatMessage("");
    Socket.emit("Message", `{"title":"${roomName}"}`, ChatMessage);
  };

  useEffect(() => {
      if (Socket.connected) {
        Socket.on("Message", function ({ Message }) {
          const messagelist = [...messages];
          messagelist.push(<div className=" messageitem ">{Message}</div>);
          addMessageToChat(messagelist);
        });
      }
    
  }, []);

  return (
    <div className="col" style={{ maxWidth: `${isOpen ? "100%" : "5%"}` }}>
      <div onClick={() => openChat(!isOpen)} className="btn btn-success">
        chat
      </div>
      <form onSubmit={SendMessageChat}>
        <div className={`mb-3 ${isOpen ? "" : "d-none"}`}>
          <div>{messages.map((item) => item)}</div>

          <input
            className="form-control"
            type={"text"}
            onChange={(e) => setChatMessage(e.target.value)}
            name="chatMessage"
          ></input>
          <button className="btn  btn-success">send</button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
