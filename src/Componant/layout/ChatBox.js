import React, { useState, useContext } from "react";
import { useEffect } from "react";
import { SocketContext } from "../../contextApi/Contexts/socket";
import { AppContext } from "../../contextApi/Contexts/AppContext";
import {
  IconButton,
  Tooltip,
  Flex,
  Input,
  Box,
} from "@chakra-ui/react";
import { FcNext, FcPrevious } from "react-icons/fc";
import { IoIosSend } from "react-icons/io";
import { addMessageToChat  } from "../../contextApi/Actions/massengerHelperAction";

const ChatBox = () => {
  const [isOpen, openChat] = useState(false);
  const [ChatMessage, setChatMessage] = useState("");
  const { roomState , massengerstate , massengerDispatch } = useContext(AppContext);

  const Socket = useContext(SocketContext);

  const {HistoryChat}=massengerstate;
  const { roomName , isAudience } = roomState;



  /*
  send message to public chat board
  check if the input is empty and add it 
  to HistoryChat savet to the state empty the 
  chat box and send it to the server
  */
  const SendMessageChat = (e) => {
    e.preventDefault();
    if (ChatMessage.trim() === "") return;
   
    addMessageToChat(ChatMessage,massengerDispatch);

    setChatMessage("");
    Socket.emit("Message", `{"title":"${roomName}"}`, ChatMessage);
  };

  useEffect(() => {

    if (!Socket.connected) return;
    Socket.off("Message").on("Message", ({ Message }) => {
      addMessageToChat(Message,massengerDispatch);
    });

    Socket.off("PrivetMessage").on("PrivetMessage", ({ Message }) => {
      addMessageToChat(Message,massengerDispatch);
    });

  }, []);

if(isAudience) return <></>;
  return (
    <Box
      borderRadius={5}
      border={"1px"}
      borderColor={"gray.400"}
      p={1}
      bg={"gray.50"}
      //     direction={['column', 'column','row']} 

      w={isOpen ? ["100%","100%","50%"] : ["10%","10%","4%"]}
   //   w={["100%","100%","60%"]}
    >
      <Tooltip label="Chat">
        
        <IconButton
        m={1}
          float={"right"}
          aria-label="Chat"
          variant={"ghost"}
          onClick={() => openChat(!isOpen)}
          colorScheme={"whiteAlpha"}
          icon={isOpen ? <FcPrevious size={25} /> : <FcNext size={25} />}
        />
      </Tooltip>

      <form
        style={{ display: `${isOpen ? "" : "none"}` }}
        onSubmit={SendMessageChat}
      >
        <Box h={357}>
          {HistoryChat.map((item, i) => (
            <div className=" messageitem " key={i}>
              {item}
            </div>
          ))}
        </Box>

        <Flex w="100%" mt="5">
          <Input
            placeholder="Type Something..."
            border="1px"
            borderRadius="none"
            bg={"white"}
            value={ChatMessage}
            borderStartRadius={"md"}
            _focus={{
              border: "1px solid black",
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                //	handleSendMessage();
              }
            }}
            onChange={(e) => setChatMessage(e.target.value)}
          />
          <IconButton
            type="submit"
            bg="teal"
            color="white"
            borderEndRadius={"md"}
            borderRadius="none"
            _hover={{
              bg: "white",
              color: "black",
              border: "1px solid black",
            }}
            icon={<IoIosSend size={25} />}
          />
        </Flex>
      </form>
    </Box>
  );
};

export default ChatBox;
