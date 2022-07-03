import React, { useContext, useEffect } from "react";

import { AppContext } from "../../contextApi/Contexts/AppContext";
import { SocketContext } from "../../contextApi/Contexts/socket";
import GuestView from "../GuestView";
import { useRef } from "react";
import ChatBox from "./ChatBox";
import { Grid, Flex, Box, GridItem } from "@chakra-ui/react";

const VideoCards = () => {
  const CanvasImg = useRef(null);

  //const videoSourcs = [useRef(null),useRef(null),useRef(null),useRef(null)]
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

  /* useEffect(()=>{
  console.log('UPLOADING THE IMGES');
  console.log(Socket.id , adminId , mainVid?.current?.play)
  if(Socket.id == adminId && mainVid?.current?.play){
    TakeThumbnailImage()
  }

},[Socket,adminId,mainVid?.current?.play]) */

  //   useEffect(()=>{
  //    guestList[0].feed=videoSourcs[0];

  /*         let GuestEditer = [...guestList]
        GuestEditer.forEach((g, i) => {
      GuestEditer[i][0] = React.createRef();
      GuestEditer[i][1] = 0;
      GuestEditer[i][2] = true;
      
    })
    upDateGuestList(GuestEditer,roomDispatch)
 */
  //   },[])

  useEffect(() => {
    console.log(roomState);
    console.log(guestList);
    console.log(userMediaTrack);

    if (userMediaTrack && !guestList[0].feed.current.srcObject)
      guestList[0].feed.current.srcObject = userMediaTrack;
  }, [userMediaTrack]);

  const ToggleElementCssClass = (i) => {
    /*     let stv = this.state.case.indexOf(true)
    
        let nev = this.state.ChangeStatVale[i][stv]
    
        let cc = [...this.state.case]
    
        cc[stv] = false
        cc[nev] = true
        this.setState({ case: cc }); */
  };

  const GetElemntCssClass = (Postion) => {
    /*  return view[Postion][this.state.case.indexOf(true)] */
  };

  const IsVedioElemntVisble = (id) => {
    if (id === 0) return false;

    return true;
  };

  //open or close the dilog for a selected user
  //identfi the user that clicked on and safe the state
  //of the box
  const ToogleBox = (guest) => {
    /* 
    let Guests = [...guestList]
    let index = guestList.indexOf(guest)

    if (guestList[2]) {
      Guests[index][2] = false
      this.setState({ guest: Guests })

    } else {
      Guests[index][2] = true
     // this.setState({ guest: Guests })
    } */
  };

  /*   console.log(guestList)
  console.log(guestList)

if(!guestList[0]) {
  return <h4>loading</h4>
}else{
  return <h1>load</h1>
} */

  const getListGustLength = () => {
    const itemLen = guestList.filter((item) => item.id !== 0);
    console.log(itemLen);
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
        <Box  w={"full"}>
          <video
          style={{borderRadius:"5px",borderColor:"#f1f1f1"}}
            ref={guestList[0].feed}
            onPlay={TakeThumbnailImage}
            autoPlay
          ></video>
        </Box>

        {(getListGustLength() > 1) ? 
          <Box w={"full"}>
            <Grid templateColumns="repeat(2, 1fr)" gap={3}>
              <GridItem>
                <GuestView
                  size={getListGustLength()}
                  Guest={guestList[1]}
                ></GuestView>
              </GridItem>

              <GridItem>
                <GuestView
                  size={getListGustLength()}
                  Guest={guestList[2]}
                ></GuestView>
              </GridItem>

              <GridItem>
                <GuestView
                  size={getListGustLength()}
                  Guest={guestList[3]}
                ></GuestView>
              </GridItem>
            </Grid>
          </Box>
      :null}
      </Flex>

      {/*  // {guestList.map((guest,Index)=>(Index && guest.id) &&  )}
       */}
      <br></br>

      {/*   <video ref={guestList[1].feed} autoPlay className="Vd-box h-0 w-50 "></video>  <br></br>
 
 <video ref={guestList[2].feed} autoPlay className="Vd-box h-0 w-50 "></video>  <br></br>
 
 <video ref={guestList[3].feed} autoPlay className="Vd-box h-0 w-50 "></video> */}
      {/* 
  {guestList.map((guest,Index)=>(Index && guest.id) && )}
 */}
    </>
  );
};

export default VideoCards;
