import React, { useEffect, useContext } from "react";

import { useMediaSoupHelper } from "../lib/hooks/mediaSoupHelper";

import { useRoomManger } from "../lib/hooks/roomMangerHelper";
import { ToastContainer } from "react-toastify";

import Layout from "../Componant/layout/Layout";
import ControlePanle from "../Componant/layout/ControlePanle";
import VideoCards from "../Componant/layout/VideoCards";
import { AppContext } from "../contextApi/Contexts/AppContext";
//import { SocketContext } from "../contextApi/Contexts/socket";
import { useLocation } from "react-router-dom";
import { SocketContext } from "../contextApi/Contexts/socket";

function CallBord() {
  const { roomState } = useContext(AppContext);
  //const Socket = useContext(SocketContext);
  const { userMediaTrack, adminId } = roomState;

  const { startStreming, Unmount } = useMediaSoupHelper();

  const { CreateOrJoinTheRoom } = useRoomManger(startStreming);
  const location = useLocation();
  const Socket = useContext(SocketContext);

 
  /*   if (!Socket.connected) {
    console.log("SOCKET EFFT CONNECT");
    Socket.connect();
    //  return
  }else{
    console.log('CONNECTED JUST CONNNECTED')
  } */

  useEffect(() => {

    if (
      (userMediaTrack || location?.state?.IsViewer) &&
      !adminId &&
      Socket.connected
    )
      CreateOrJoinTheRoom();
  }, [userMediaTrack, adminId, Socket]);

  useEffect(() => {
    return () => Unmount();
  }, []);

  /* 
useEffect(() => {
  const handleTabClose = event => {
    event.preventDefault();

    Unmount()
   // return (event.returnValue = 'Are you sure you want to exit?');
  };

  window.addEventListener('beforeunload', handleTabClose);

  return () => {
    window.removeEventListener('beforeunload', handleTabClose);
  };
}, []);
 */

  return (
    <Layout>
      <ToastContainer />

      <ControlePanle></ControlePanle>

      <VideoCards></VideoCards>
    </Layout>
  );
}

export default CallBord;
