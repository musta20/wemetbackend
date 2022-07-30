import React, { useContext, useEffect } from "react";


import { AppContext } from "../../contextApi/Contexts/AppContext";
import { SocketContext } from "../../contextApi/Contexts/socket";

import { useRef } from "react";
import ChatBox from "./ChatBox";
import { Grid, Flex, Box, GridItem, Spacer } from "@chakra-ui/react";
import ModalBox from "../Modal";

const VideoCards = () => {
  const CanvasImg = useRef(null);

  const Socket = useContext(SocketContext);

  const { roomState } = useContext(AppContext);

  const { adminId, userMediaTrack, guestList } = roomState;

 
  //this function take small imge from the user video
  // and send it to the server as a thumnail imge
  const TakeThumbnailImage = () => {
    if (Socket.id != adminId) return;

    let context = CanvasImg.current.getContext("2d");

    context.drawImage(guestList[0].feed.current, 0, 0, 280, 200);

    let data = CanvasImg.current.toDataURL("image/png", 0.1);

    Socket.emit("saveimg", data, (data) => {
    });

    let reternde = guestList.findIndex((item) => item.id == 0);
  };

  useEffect(() => {
    if (userMediaTrack && !guestList[0].feed.current.srcObject)
      guestList[0].feed.current.srcObject = userMediaTrack;

  }, [userMediaTrack]);



  return (
    <>
      <canvas
        ref={CanvasImg}
        style={{ display: "none" }}
        width="280"
        height="200"
        id="canvas"
      ></canvas>
      <Flex mt={2} p={1} 
     direction={['column', 'column','row']} 
 
      >

        <ChatBox  />
        <Spacer />

        <Box p={1} w={"full"}>
        <ModalBox id={guestList[0].id}  />

          <video
            style={{ borderRadius: "5px", borderColor: "#e8e8e8" }}
            ref={guestList[0].feed}
            onPlay={TakeThumbnailImage}
            autoPlay
          ></video>
        </Box>
        <Spacer />

        <Box  p={1} w={"full"}>
          <Grid templateColumns="repeat(2, 1fr)"  p={1} gap={3}>
            <GridItem p={1}
              display={`${guestList[1].id === 0 && "none"}`}
              position={"relative"}
              w={"full"}
            >
              <ModalBox id={guestList[1].id}  />

              <video
                style={{ borderRadius: "5px", border: "1px solid #bfbfbf" }}
                ref={guestList[1].feed}
                autoPlay
              ></video>
            </GridItem>

            <GridItem p={1}
              display={`${guestList[2].id === 0 && "none"}`}
              position={"relative"}
              w={"full"}
            >
                      <ModalBox id={guestList[2].id} />

              <video
                style={{ borderRadius: "5px", border: "1px solid #bfbfbf" }}
                ref={guestList[2].feed}
                autoPlay
              ></video>
            </GridItem>

            <GridItem p={1}
              display={`${guestList[3].id === 0 && "none"}`}
              position={"relative"}
              w={"full"}
            >
              <ModalBox id={guestList[3].id}  />
              <video
                style={{ borderRadius: "5px", border: "1px solid #bfbfbf" }}
                ref={guestList[3].feed}
                autoPlay
              ></video>
            </GridItem>
          </Grid>
        </Box>
      </Flex>
    </>
  );
};

export default VideoCards;
