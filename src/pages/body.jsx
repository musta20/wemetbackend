import React, { useContext, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import BodyFooter from "../Componant/BodyFooter";
import { useNavigate } from "react-router-dom";

import { SocketContext } from "../contextApi/Contexts/socket";
import {
  GridItem,
  Container,
  Badge,
  Button,
  Box,
  Grid,
  Text,
  Stack,
} from "@chakra-ui/react";
import Footer from "../Componant/Footer";

export default function Body() {
  const navigate = useNavigate();

  const [Rooms, setRooms] = useState([]);

  const Socket = useContext(SocketContext);

  useEffect(() => {
    //this event delete a room from the list
    Socket.on("DelteRoom", ({ TheroomName }) => {
      console.log("DelteRoom");
      console.log(Rooms);
      if (Rooms.length === 0) return;
      let Rooms = [...Rooms];
      Rooms = Rooms.filter((room) => room !== TheroomName);
      setRooms(Rooms);
    });

    //this event add a room from the list
    Socket.on("AddRoom", ({ roomName }) => {
      console.log("AddRoom");

      console.log(Rooms);
      if (Rooms.length === 0) {
        let theRooms = [roomName];

        setRooms(theRooms);
        return;
      }
      let theRooms = [...Rooms, roomName];

      setRooms(theRooms);
    });

    //request the currnt live room in the server
    Socket.emit("getroom", "mainrrom", (data) => {
      console.log("THE DATA RETREVED FROM THE SERVER");
      console.log(data);
      setRooms(data);
    });
  }, []);

  //this function will take the user to call room as viewr
  const GoToCallRoomWatch = (e) => {
    let roomName = e.target.id;

    navigate("/CallBorad/" + roomName, {
      state: {
        IsPublic: false,
        IsViewer: true,
      },
    });
  };

  //this function will take the user to room as memper
  const join = (e) => {
    let roomName = e.target.id;

    navigate("/CallBorad/" + roomName, {
      state: {
        IsPublic: false,
        IsViewer: false,
      },
    });
  };

  //this function display empty room message
  const NoRoome = () => {
    return (    <Container maxW={'2xl'}>
    <Stack
      textAlign={'center'}
      align={'center'}
      spacing={{ base: 4, md: 5 }}
      py={{ base: 10, md: 14 }}>
           
              <div className="mainstreamicon"></div>
             <Text
             textAlign={"center"}
             fontFamily={"mono"}
             >
                It's seem like no one is streamming
                <br />
                how abut being the frist
              </Text>
          </Stack>
          </Container>
    );
  };

  //this function will show the live room in the server
  return (
    <>
      <Box  m={3} p={3}>
      {!Rooms.length && NoRoome()}
        <Grid 
                justifyItems="center"
                gridTemplateColumns={{
                  base: "1fr  ",
                  md: "1fr 2fr  3fr"
                }}
         
        templateColumns="repeat(4, 1fr)" gap={5}>
          {Rooms.length
            ? Rooms.map((roomName) => (
                <GridItem>
                  <div
                    id={roomName}
                    style={{
                      width: "280px",
                      height: "200px",
                      backgroundImage:
                        "url(http://localhost:6800/imges/" + roomName + ".png)",
                    }}
                  >
                    <Badge 
                    m={1}
                    variant="outline" colorScheme="red">
                      LIVE
                    </Badge>
                    <Box p={3} my={20}>
                      <Button
                        id={roomName}
                        colorScheme={"facebook"}
                        bg={"#6da6fc"}
                        size="sm"
                        m={1}
                        onClick={(e) => GoToCallRoomWatch(e)}
                      >
                        just watch
                      </Button>
                      <Button
                        m={1}
                        id={roomName}
                        colorScheme={"facebook"}
                        bg={"#6da6fc"}
                        size="sm"
                        onClick={(e) => join(e)}
                      >
                        join this room
                      </Button>
                    </Box>
                  </div>
                </GridItem>
              ))
            :  null}
        </Grid>
      </Box>
      <Footer></Footer>
    </>
  );
}
