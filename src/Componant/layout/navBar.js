import {
  Box,
  Flex,
  FormLabel,
  Button,
  Menu,
  Stack,
  Modal,
  Tooltip,
  IconButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  AlertIcon,
  Switch,
  Text,
  Input,
  Alert,
  useDisclosure,
} from "@chakra-ui/react";

import Ajv from "ajv";
import { SocketContext } from "../../contextApi/Contexts/socket";
import { FcWebcam, FcHome } from "react-icons/fc";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Nav() {
  const Socket = useContext(SocketContext);

  const ajv = new Ajv();

  const [Warning, setWarning] = useState([true, ""]);
  const [TheRoom, setTheRoom] = useState("");
  const [IsPublic, setIsPublic] = useState(true);
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const schema = {
    properties: {
      name: {
        type: "string",
        minLength: 5,
        maxLength: 8,
        pattern: "^[a-zA-Z0-9]{4,10}$",
      },
    },
  };

  //this function will take the user to the main bage
  const GoHome = () => {
    navigate("/");
  };

  //this function will take the user to the stramin room
  const GoStream = () => {
    onClose();
    if (!Warning[0] || !TheRoom) return;
    navigate("/meet/" + TheRoom, {
      state: {
        IsPublic: IsPublic,
        IsViewer: false,
      },
    });
  };
  const connectToServer = async () => {
    if (!Socket.connected) await Socket.connect();
  };

  //check api valible room name
  const isRoomeValid = (value) => {
    //  console.log(socket)

    Socket.emit("IsRommeExist", '{"title":"' + value + '"}', (data) => {
      if (data.status) {
        setWarning([true, "the room name is valed"]);
        return;
      }

      setWarning([false, "the name is not valed " + data.room]);
    });
  };

  //this function will store the value of the input in the state and vladate it
  const onchange = (e) => {
    setTheRoom(e.target.value);

    if (e.target.value.length < 3) return;

    var valid = ajv.validate(schema, { name: e.target.value });
    if (!valid) {
      if (
        ajv.errors[0].message === 'must match pattern "^[a-zA-Z0-9]{4,10}$"'
      ) {
        setWarning([
          false,
          "the name is not valid special character is not allowed",
        ]);
      } else {
        setWarning([false, "the name is not valed " + ajv.errors[0].message]);
      }

      return;
    }
    // console.log('emmiyedd')

    isRoomeValid(e.target.value);
  };

  useEffect(() => {
    connectToServer();
  }, []);

  return (
    <>
      <Box bgGradient="linear(to-l, #cc6699,  #33ccff)" py={1} px={2}>
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Flex>
            <div className="Logo"></div>
            <Text m={3} color={"whiteAlpha.900"} fontWeight={"bold"}>
              wemet
            </Text>
          </Flex>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Menu>
                <Tooltip label="start streaming">
                  <IconButton
                    onClick={onOpen}
                    aria-label="start meet"
                    variant={"ghost"}
                    colorScheme={"whiteAlpha"}
                    icon={<FcWebcam size={35} />}
                  />
                </Tooltip>
                <Tooltip label="Home">
                  <IconButton
                    aria-label="Home"
                    onClick={() => GoHome()}
                    variant={"ghost"}
                    role={"group"}
                    colorScheme={"whiteAlpha"}
                    icon={<FcHome size={35} />}
                  />
                </Tooltip>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>chosse a room name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              isInvalid={!Warning?.[0]}
              type={"text"}
              name="roomName"
              value={TheRoom}
              onChange={(e) => onchange(e)}
              placeholder="type the room name"
            ></Input>
            {Warning?.[1] && (
              <Alert mt={1} status={`${Warning?.[0] ? "success" : "error"}`}>
                <AlertIcon />

                {Warning?.[1]}
              </Alert>
            )}
          </ModalBody>

          <ModalFooter>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="is-public" mb="0">
                Public room (Visible for everyone)?
              </FormLabel>
              <Switch
                checked={IsPublic}
                onChange={(e) => setIsPublic(!e.target.checked)}
                id="is-public"
              />
            </FormControl>
            <Button
              bgGradient="linear(to-l, #cc6699,  #33ccff)"
              colorScheme={"telegram"}
              mr={3}
              onClick={GoStream}
            >
              Stream
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
//#66c2ff
