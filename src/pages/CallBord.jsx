import React, { useEffect, useContext } from "react";

import { useMediaSoupHelper } from "../lib/hooks/mediaSoupHelper";

import { useRoomManger } from "../lib/hooks/roomMangerHelper";
import { ToastContainer } from "react-toastify";

import Layout from "../Componant/layout/Layout";
import ControlePanle from "../Componant/layout/ControlePanle";
import VideoCards from "../Componant/layout/VideoCards";
import { AppContext } from "../contextApi/Contexts/AppContext";
import { SocketContext } from "../contextApi/Contexts/socket";
import { useLocation } from "react-router-dom";

function CallBord() {
  const { roomState  } = useContext(AppContext);
  const Socket = useContext(SocketContext);
  const { userMediaTrack, adminId } = roomState;

  const { startStreming , Unmount } = useMediaSoupHelper();

  const { CreateOrJoinTheRoom } = useRoomManger(startStreming);
  const location = useLocation();

  

  useEffect(() => {
    

    if ((userMediaTrack || location?.state?.IsViewer) && !adminId) CreateOrJoinTheRoom();


  }, [userMediaTrack, adminId]);

useEffect(()=>{
   return ()=> Unmount()

},[])
  return (
    <Layout>

      <ToastContainer />

      <ControlePanle></ControlePanle>

      <VideoCards></VideoCards>
      
    </Layout>
  );
}

export default CallBord;
