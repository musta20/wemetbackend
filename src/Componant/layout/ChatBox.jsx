import React, { useState, useContext } from "react";
import { useEffect } from "react";
import { SocketContext } from "../../contextApi/Contexts/socket";
import { AppContext } from "../../contextApi/Contexts/AppContext";
import {
  Button,
  IconButton,
  Tooltip,
  Flex,
  Input,
  Box,
} from "@chakra-ui/react";
import { FcNext, FcPrevious } from "react-icons/fc";
import { IoIosSend } from "react-icons/io";

const ChatBox = () => {
  const [isOpen, openChat] = useState(false);
  const [AllMessages, addMessageToChat] = useState([]);
  const [ChatMessage, setChatMessage] = useState(null);

  const Socket = useContext(SocketContext);

  const { roomState } = useContext(AppContext);

  const { roomName } = roomState;



  /*
  send message to public chat board
  check if the input is empty and add it 
  to HistoryChat savet to the state empty the 
  chat box and send it to the server
  */
  const SendMessageChat = (e) => {
    e.preventDefault();
    if (ChatMessage.trim() === "") return;
    let messagelist = [...AllMessages];
    messagelist.push(ChatMessage);
    addMessageToChat(messagelist);

    setChatMessage("");
    Socket.emit("Message", `{"title":"${roomName}"}`, ChatMessage);
  };

  useEffect(() => {
    if (!Socket.connected) return;
    Socket.on("Message", ({ Message }) => {

      let messagelist = [...AllMessages];
      messagelist.push(Message);

      addMessageToChat(messagelist);
    });
  }, [AllMessages]);

  return (
    <Box
      borderRadius={5}
      borderColor={"#f1f1f1"}
      p={1}
      bg={"gray.100"}
      width={`${isOpen ? "40%" : "4%"}`}
    >
      <Tooltip label="Chat">
        <IconButton
          float={"right"}
          aria-label="Chat"
          variant={"ghost"}
          onClick={() => openChat(!isOpen)}
          role={"group"}
          colorScheme={"whiteAlpha"}
          icon={isOpen ? <FcPrevious size={25} /> : <FcNext size={25} />}
        />
      </Tooltip>

      <form
        style={{ display: `${isOpen ? "" : "none"}` }}
        onSubmit={SendMessageChat}
      >
        <Box h={375}>
          {AllMessages.map((item, i) => (
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
            borderStartRadius={"md"}
            _focus={{
              border: "1px solid black",
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                //	handleSendMessage();
              }
            }}
            value={ChatMessage}
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
