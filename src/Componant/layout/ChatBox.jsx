import React, { useState, useContext } from "react";
import { useEffect } from "react";
import { SocketContext } from "../../contextApi/Contexts/socket";
import { AppContext } from "../../contextApi/Contexts/AppContext";
import { Button,IconButton ,Tooltip,Flex,Input, Box } from "@chakra-ui/react";
import {  FcNext ,FcPrevious} from "react-icons/fc";

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

    <Box borderRadius={5} borderColor={"#f1f1f1"} p={1}  bg={"gray.100"}  width={`${isOpen ? "30%" : "4%"}`}  >
   

      <Tooltip  label="Chat">
                  <IconButton  float={"right"}
                    aria-label="Chat"
                    variant={"ghost"}
                    onClick={() => openChat(!isOpen)}
                    role={"group"}
                    colorScheme={"whiteAlpha"}
                    icon={isOpen ? <FcPrevious size={25} /> :  <FcNext size={25} />}
                  />
                </Tooltip>




      <form style={{display:`${isOpen ? "" : "none"}`}} onSubmit={SendMessageChat}>
      <Box h={375}>{messages.map((item) => item)}</Box>

      <Flex w="100%" mt="5">
  	<Input
    	placeholder="Type Something..."
    	border="none"
    	borderRadius="none"
    	_focus={{
      	border: "1px solid black",
    	}}
    	onKeyPress={(e) => {
      	if (e.key === "Enter") {
        //	handleSendMessage();
      	}
    	}}
    	value={messages}
    	onChange={(e) => setChatMessage(e.target.value)}
  	/>
  	<Button
    	bg="black"
    	color="white"
    	borderRadius="none"
    	_hover={{
      	bg: "white",
      	color: "black",
      	border: "1px solid black",
    	}}
    //	disabled={inputMessage.trim().length <= 0}
    //	onClick={handleSendMessage}
  	>
    	Send
  	</Button>
	</Flex>

    
      </form>
           </Box>
   
  );
};

export default ChatBox;
