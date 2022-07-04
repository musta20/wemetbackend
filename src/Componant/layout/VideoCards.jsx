import React, { useContext, useEffect } from "react";

import { AppContext } from "../../contextApi/Contexts/AppContext";
import { SocketContext } from "../../contextApi/Contexts/socket";

import { useRef } from "react";
import ChatBox from "./ChatBox";
import { Grid, Flex, Box, GridItem } from "@chakra-ui/react";
import ModalBox from "../Modal";

const VideoCards = () => {
  const CanvasImg = useRef(null);

  const Socket = useContext(SocketContext);

  const { roomState } = useContext(AppContext);

  const { adminId, userMediaTrack, guestList } = roomState;

  const view =
    //the array of class in each cases
    [
      [
        "d-none",
        "col-md-6",
        "col-md-4",
        "col-md-4",
        "d-none",
        "d-none",
        "d-none",
        "col-md-4",
      ],
      [
        "d-none",
        "d-none",
        "col-md-3",
        "col-md-2",
        "col-md-3",
        "col-md-4",
        "d-none,d-none",
      ],
      [
        "col-md-7",
        "col-md-6",
        "col-md-5",
        "col-md-4",
        "col-md-6",
        "col-md-6",
        "col-md-6",
        "col-md-5",
      ],
      [
        "d-none",
        "d-none",
        "d-none",
        "col-md-2",
        "col-md-3",
        "d-none",
        "col-md-4",
        "col-md-3",
      ],
    ];

  //this function take small imge from the user video
  // and send it to the server as a thumnail imge
  const TakeThumbnailImage = () => {
    if (Socket.id != adminId) return;

    let context = CanvasImg.current.getContext("2d");

    context.drawImage(guestList[0].feed.current, 0, 0, 280, 200);

    let data = CanvasImg.current.toDataURL("image/png", 0.1);
    console.log("IMGE EMITED TO SERVER ");

    Socket.emit("saveimg", data, (data) => {
      console.log("IMGE EMITED TO SERVER ");
    });

    let reternde = guestList.findIndex((item) => item.id == 0);
    console.log(reternde);
  };

  useEffect(() => {
    if (userMediaTrack && !guestList[0].feed.current.srcObject)
      guestList[0].feed.current.srcObject = userMediaTrack;
  }, [userMediaTrack]);

  const getListGustLength = () => {
    const itemLen = guestList.filter((item) => item.id !== 0);
    console.log(itemLen.length);
    return itemLen.length;
  };
  return (
    <>
      <canvas
        ref={CanvasImg}
        style={{ display: "none" }}
        width="280"
        height="200"
        id="canvas"
      ></canvas>
      <Flex mt={2}>
        <ChatBox />
        <Box w={"full"}>
          <video
            style={{ borderRadius: "5px", borderColor: "#f1f1f1" }}
            ref={guestList[0].feed}
            onPlay={TakeThumbnailImage}
            autoPlay
          ></video>
        </Box>
        <Box w={"full"}>
          <Grid templateColumns="repeat(2, 1fr)" gap={3}>
            <GridItem
              display={`${guestList[1].id === 0 && "none"}`}
              position={"relative"}
              w={"full"}
            >
              <ModalBox />

              <video
                style={{ borderRadius: "5px", border: "1px solid #bfbfbf" }}
                ref={guestList[1].feed}
                autoPlay
              ></video>
            </GridItem>

            <GridItem
              display={`${guestList[2].id === 0 && "none"}`}
              position={"relative"}
              w={"full"}
            >
                      <ModalBox />

              <video
                style={{ borderRadius: "5px", border: "1px solid #bfbfbf" }}
                ref={guestList[2].feed}
                autoPlay
              ></video>
            </GridItem>

            <GridItem
              display={`${guestList[3].id === 0 && "none"}`}
              position={"relative"}
              w={"full"}
            >
              <ModalBox />
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
