import { useContext } from "react"
import {MainRoomContex} from "../../contextApi/Contexts/AppContext"


import {addChatMessage , addPrivetMessage , addMessageToChat } from "../../contextApi/Actions/massengerHelperAction"
const chatBox = ()=>{
 const {  massengerstate , massengerDispatch }=   useContext(MainRoomContex)
 const   {
    HistoryChat ,
    ChatMessage ,
    PrivetMessage
  } =massengerstate;
    /*
  send a Privet message to user
  check if the input is empty and add it 
  to HistoryChat savet to the state empty the 
  chat box and send it to the server
  */
  const SendPrivetMessage = (e) => {
    e.preventDefault();
    if (PrivetMessage.trim() === "") return;

    addMessageToChat(<div className=" messageitem ">{PrivetMessage}</div>,massengerDispatch);
    addPrivetMessage("");
    Socket.emit(
      "SendPrivetMessage",
      { id: e.target.id, Message: PrivetMessage },
      (room) => {
        console.log(room);
      }
    );
  };

  /*
  send message to public chat board
  check if the input is empty and add it 
  to HistoryChat savet to the state empty the 
  chat box and send it to the server
  */
  const SendMessageChat = (e) => {
    e.preventDefault();
    if (ChatMessage.trim() === "") return;

    addMessageToChat(<div className=" messageitem ">{PrivetMessage}</div>,massengerDispatch);

    addChatMessage("");
    Socket.emit("Message", '{"title":"' + Room + '"}', ChatMessage);
  };
    return       <div className={GetElemntCssClass(0) + ` chatback`}>
    <form className="form-inline h-80 justify-content-md-center ">
      <div className="h-100 w-80 overflow-auto">
        <div className="mhchat">{HistoryChat}</div>
      </div>
      <input
        onChange={(e) => addChatMessage(e.target.value,massengerDispatch)}
        type="text"
        className="w-80 form-control"
        value={ChatMessage}
        name="ChatMessage"
        placeholder="Chat here"
      ></input>

      <button
        type="submit"
        onClick={SendMessageChat}
        className=" btn sendc"
      ></button>
      <div className="input-group-prepend"></div>
    </form>
  </div>


}

export default chatBox;