import { React, useContext, useState } from "react";
import { SocketContext } from "../contextApi/Contexts/socket";
import { AppContext } from "../contextApi/Contexts/AppContext";
import {
  Button,
  Modal,
  IconButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Flex,
  ModalCloseButton,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { addMessageToChat } from "../contextApi/Actions/massengerHelperAction";
import { FcMenu } from "react-icons/fc";
import { IoIosSend } from "react-icons/io";

function ModalBox({ id }) {
  const { roomState, massengerDispatch } =
    useContext(AppContext);

  const { adminId , isAudience } = roomState;
  const Socket = useContext(SocketContext);
  const [PrivetMessage, setPrivetMessage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  /*
  send a Privet message to user
  check if the input is empty and add it 
  to HistoryChat savet to the state empty the 
  chat box and send it to the server
  */

  const SendPrivetMessage = () => {
    if (PrivetMessage.trim() === "") return;

    addMessageToChat(PrivetMessage, massengerDispatch);

    Socket.emit("SendPrivetMessage", { id : id, Message: PrivetMessage }, (room) => {
      console.log(room);
    });
    setPrivetMessage("");

  };
  if (id === Socket.id  || isAudience) return <></>;
  return (
    <>
      <IconButton
        onClick={() => onOpen()}
        position={"absolute"}
        float={"right"}
        aria-label="Chat"
        zIndex={1}
        m={1}
        variant={"outline"}
        role={"group"}
        colorScheme={"gray"}
        icon={<FcMenu size={25} />}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>chosse a room name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {Socket.id === adminId ? (
              <Button m={1} colorScheme={"red"}>
                Remove User From Room
              </Button>
            ) : null}
            <Flex w="100%" mt="5">
              <Input
                border={"1px"}
                borderRadius="none"
                isInvalid={false}
                type={"text"}
                name="roomName"
                value={PrivetMessage}
                borderStartRadius={"md"}
                onChange={(e) => setPrivetMessage(e.target.value)}
                placeholder="Send Privet Message"
              ></Input>

              <IconButton
                bg="teal"
                color="white"
                borderEndRadius={"md"}
                onClick={() => SendPrivetMessage()}
                borderRadius="none"
                _hover={{
                  bg: "white",
                  color: "black",
                  border: "1px solid black",
                }}
                icon={<IoIosSend size={25} />}
              />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ModalBox;
