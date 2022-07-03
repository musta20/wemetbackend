import { AppContext } from "../../contextApi/Contexts/AppContext";

import { useContext } from "react";

import { isRoomPublic } from "../../contextApi/Actions/roomHelperAction";
import { SocketContext } from "../../contextApi/Contexts/socket";
import { useNavigate } from "react-router-dom";
import {
  Switch,
  FormControl,
  Box,
  FormLabel,
  HStack,
  Button,
} from "@chakra-ui/react";

import { setIsFreeToJoin } from "../../contextApi/Actions/roomHelperAction";
const ControlePanle = () => {
  const { mediaSoupstate, mediaSoupDispatch, roomState, roomDispatch } =
    useContext(AppContext);
  const Socket = useContext(SocketContext);

  const { isAudience, roomName, isStreamed, adminId, isPublic, isFreeToJoin } =
    roomState;

  const navigate = useNavigate();

  
  const LockRoom = (e) => {
    isRoomPublic(e.target.checked, mediaSoupDispatch);
  };

  const doHiddeTheRoom = (e) => {
    
  };
  const isStream = () => {};
  const JoinTheRoom = () => {
    console.log("roomName  JoinTheRoom JoinTheRoom");
    console.log(roomName);

    navigate("/Switcher", {
      state: {
        roomName: roomName,
        IsPublic: true,
        IsViewer: false,
      },
    });
  };

  return (
    <>
  

      {adminId === Socket.id && (
        <HStack m={1}>
          <FormControl
            p={1}
            borderRadius={"2xl"}
            border={"1px"}
            borderColor={"gray.100"}
            display={"flex"}
            w={"auto"}
          >
            <FormLabel border={1} htmlFor="email-alerts" mb="0">
              Streaming{" "}
            </FormLabel>
            <Switch
              onChange={(e) => LockRoom(e)}
              checked={isStreamed}
              name="Lock"
              id="Lock"
            />
          </FormControl>

          <FormControl
            p={1}
            borderRadius={"2xl"}
            border={"1px"}
            borderColor={"gray.100"}
            display={"flex"}
            w={"auto"}
          >
            <FormLabel htmlFor="email-alerts" mb="0">
              Public
            </FormLabel>
            <Switch
              onChange={(e) => doHiddeTheRoom(e)}
              checked={isPublic}
              name="HiddeTheRoom"
              id="is-public"
            />
          </FormControl>
          <FormControl
            p={1}
            borderRadius={"2xl"}
            border={"1px"}
            borderColor={"gray.100"}
            display={"flex"}
            w={"auto"}
          >
            <FormLabel htmlFor="email-alerts" mb="0">
              Stop public Streaming
            </FormLabel>
            <Switch
              onChange={(e) => isStream(e)}
              checked={isStreamed}
              name="HiddeTheRoom"
              id="istreaming"
            />
          </FormControl>
     
        </HStack>
      )}
{isFreeToJoin && <Button
        borderRadius={"2xl"}
        colorScheme={"green"}
        size='sm'
        onClick={() => JoinTheRoom()}
      >
         Join
      </Button>}

    </>
  );
};

export default ControlePanle;
