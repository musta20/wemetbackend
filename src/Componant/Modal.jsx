import { React, useContext } from "react";
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

import { FcMenu } from "react-icons/fc";
import { IoIosSend } from "react-icons/io";

function ModalBox() {
  const { roomState } = useContext(AppContext);

  const { adminId } = roomState;
  const Socket = useContext(SocketContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  /*
  send a Privet message to user
  check if the input is empty and add it 
  to HistoryChat savet to the state empty the 
  chat box and send it to the server
  */

     const SendPrivetMessage = (e) => {
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
  }; 
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
                //value={TheRoom}
                borderStartRadius={"md"}
                onChange={(e) => onchange(e)}
                placeholder="Send Privet Message"
              ></Input>


<IconButton
        onClick={() => {}}
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
          </ModalBody>

        </ModalContent>
      </Modal>
    </>
  );
}

export default ModalBox;
