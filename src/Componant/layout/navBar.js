import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  

  useColorModeValue,
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
  useDisclosure,
} from "@chakra-ui/react";

import Ajv from "ajv";
import { SocketContext } from "../../contextApi/Contexts/socket";
import { FcWebcam, FcHome } from "react-icons/fc";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export default function Nav() {
  const Socket = useContext(SocketContext);

  const [ajv, setAjv] = useState(new Ajv());

  const [Warning, setWarning] = useState([null, ""]);
  const [RoomName, setRoomName] = useState([null, ""]);
  const [Rooms, setRooms] = useState(null);
  const [TheRoom, setTheRoom] = useState("");
  const [toggleNav, settoggleNav] = useState(true);
  const [isBoxToggleOn, setisBoxToggleOn] = useState(true);
  const [IsPublic, setIsPublic] = useState(true);
  const [IsRommeExist, setIsRommeExist] = useState(true);
  const navigate = useNavigate();

  const ENDPOINT = `http://localhost:6800`;
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [schema, setschema] = useState({
    properties: {
      name: {
        type: "string",
        minLength: 5,
        maxLength: 8,
        pattern: "^[a-zA-Z0-9]{4,10}$",
      },
    },
  });

  //this function will take the user to the main bage
  const GoHome = () => {
    navigate("/");
  };

  //this function will take the user to the stramin room
  const GoStream = () => {
    navigate("/CallBorad/" + TheRoom, {
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
        setRoomName("form-control border border-success");
        setWarning(["form-text text-success", "the room name is valed"]);
        return;
      }

      setRoomName("form-control border border-danger");
      setWarning([
        "form-text text-danger",
        "the name is not valed " + data.room,
      ]);
    });
  };
  //this function will store the value of the input in the state and vladate it
  const onchange = (e) => {
    setTheRoom(e.target.value);

    if (e.target.value.length < 3) return;

    var valid = ajv.validate(schema, { name: e.target.value });
    if (!valid) {
      setRoomName("form-control border border-danger");
      if (
        ajv.errors[0].message === 'must match pattern "^[a-zA-Z0-9]{4,10}$"'
      ) {
        setWarning([
          "form-text text-danger",
          "the name is not valid special character is not allowed",
        ]);
      } else {
        setWarning([
          "form-text text-danger",
          "the name is not valed " + ajv.errors[0].message,
        ]);
      }

      return;
    }
    // console.log('emmiyedd')

    isRoomeValid(e.target.value);
  };

  //this function will empty the filed
  //and close the dilog and take the use to the stram
  const StartCreatingTheRoom = (e) => {
    setRoomName("form-control border");

    setTheRoom("");
    GoStream();
    // ToogleRoomNameBox()
  };

  //this function get called the to save the value of the check box to the state
  const UpdateCheckBox = (e) => {
    setIsPublic(e.target.checked);
    console.log(IsPublic);
  };

  //this function will toggle the nav dilog

  //this function will toggle the nav bar on small view
  const CollapsaNav = (e) => {
    if (toggleNav) {
      settoggleNav(false);
    } else {
      settoggleNav(true);
    }
  };
  useEffect(() => {
    connectToServer();
  }, []);

  const navItemIconHover = (target, type) => {
    if (type) {
      target.style.height = 50;
      target.style.width = 50;
      return;
    }

    target.style.height = 35;
    target.style.width = 35;
  };

  return (
    <>
      <Box bgGradient="linear(to-l, #cc6699,  #33ccff)" px={3}>
        <Flex h={20} alignItems={"center"} justifyContent={"space-between"}>
          <Box>
            {" "}
            <div className="Logo"></div>
          </Box>

          <Flex alignItems={"center"}>
            <Stack   direction={"row"} spacing={7}>
              <Menu
            
              >  <Tooltip label='start streaming'>

                <IconButton
                onClick={onOpen}
                  aria-label="start meet"
                  variant={"ghost"}

                  

                  colorScheme={"whiteAlpha"}
                  icon={<FcWebcam size={35} />}
                />
                </Tooltip>
  <Tooltip label='Home'>

                <IconButton
                  aria-label="Home"
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
     < Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            fsdfsdfsdfs
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
