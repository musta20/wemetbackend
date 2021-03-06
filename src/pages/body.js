import React, { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { SocketContext } from "../contextApi/Contexts/socket";
import {
  GridItem,
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
    Socket.off("DelteRoom").on("DelteRoom", ( {TheroomName} ) => {
   

      let copyRooms = [...Rooms];
    let newCopy =  copyRooms.filter(room => room !== TheroomName);

      setRooms(newCopy);
    });

    //this event add a room from the list
    Socket.off("AddRoom").on("AddRoom", ( {title} ) => {
      let copyRoom =[...Rooms]
      copyRoom.push(title)

      setRooms(copyRoom);
    });

 
  }, [Rooms,Socket]);
  useEffect(()=>{   //request the currnt live room in the server
    Socket.emit("getroom", "mainrrom", (data) => {

     //setRooms(['fsdfsd','efefe','efefe','efefe','efefe','efefe','efefe','efefe','testtt']);
     setRooms(data);
    });},[Socket])

  //this function will take the user to call room as viewr
  const GoToCallRoomWatch = (e) => {
    let roomName = e.target.id;

    navigate("/meet/" + roomName, {
      state: {
        IsPublic: false,
        IsViewer: true,
      },
    });
  };

  //this function will take the user to room as memper
  const join = (e) => {
    let roomName = e.target.id;

    navigate("/meet/" + roomName, {
      state: {
        IsPublic: false,
        IsViewer: false,
      },
    });
  };

  //this function display empty room message
  const NoRoome = () => {
    return (  
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

It's seem like no one is streaming<br /> howe about being the first


      
              </Text>
          </Stack>
    );
  };
//console.log(`url(${process.env.REACT_APP_BACKE_END_URL}/imges/${roomName}.png)`)
  //this function will show the live room in the server
  return (
    <>
{/*       <Center  m={3} p={3}>
 */}
      <div
className="mainRoomClass"
      >
      {!Rooms.length && NoRoome()}

      
        
        <Grid 
        m={5}
        p={5}
        w={"full"}
                gridTemplateColumns={{
                  
                  base: "1fr",
                  md: "1fr  1fr ",
                  lg:"1fr 1fr 1fr"
                  
                }}

         
        templateColumns="repeat(4, 1fr)"
         gap={5}>
          {Rooms.length
            ? Rooms.map((roomName) => (
                <GridItem
                                key={roomName}>
                  <div
                    id={roomName}
                    style={{
                      width: "280px",
                      height: "200px",
                      backgroundImage:
                        `url(${process.env.REACT_APP_BACKE_END_URL}/imges/${roomName}.png)`,
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
      </div>
      <Footer></Footer>
    </>
  );
}
