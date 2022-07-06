import { AppContext } from "../../contextApi/Contexts/AppContext";

import { useContext } from "react";

import { isRoomPublic , isRoomStream , HiddeTheRoom } from "../../contextApi/Actions/roomHelperAction";
import { SocketContext } from "../../contextApi/Contexts/socket";
import { useNavigate } from "react-router-dom";
import {
  Switch,
  FormControl,
  FormLabel,
  HStack,
  Button,
} from "@chakra-ui/react";


const ControlePanle = () => {
  const { mediaSoupstate, mediaSoupDispatch, roomState, roomDispatch } =
    useContext(AppContext);
  const Socket = useContext(SocketContext);

  const { isRoomLock, roomName, isStreamed, adminId, isPublic, isFreeToJoin } =
    roomState;

  const navigate = useNavigate();




  const LockRoom = (e) => {
    Socket.emit('LockTheRoom', e.target.checked, data => { })
    HiddeTheRoom( e.target.checked,roomDispatch)

  };

  const doHiddeTheRoom = (e) => {
    Socket.emit('HiddeTheRoom', e.target.checked, data => { })  
    isRoomPublic(e.target.checked, roomDispatch);
  };

  const isStream = (e) => {
    isRoomStream(e.target.checked,roomDispatch)
    Socket.emit('isStream', isStreamed, data => { })
  };

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
              lock the room
            </FormLabel>
            <Switch
              onChange={(e) => LockRoom(e)}
              isChecked={isRoomLock}
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
              room is visible
            </FormLabel>
            <Switch
              onChange={(e) => doHiddeTheRoom(e)}
              isChecked={isPublic}
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
               public Streaming
            </FormLabel>
            <Switch
              onChange={(e) => isStream(e)}
              isChecked={isStreamed}
              name="HiddeTheRoom"
              id="istreaming"
            />
          </FormControl>
        </HStack>
      )}
      {isFreeToJoin && (
        <Button
          colorScheme={"teal"}
          size="sm"
          m={1}
          onClick={() => JoinTheRoom()}
        >
          Join
        </Button>
      )}
    </>
  );
};

export default ControlePanle;
