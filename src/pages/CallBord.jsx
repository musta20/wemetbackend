import React, { useEffect, useRef, useState, useContext } from "react";
//import Modal from "./Modal";
/* import { SocketContext } from "../contextApi/Contexts/socket";
import {SocketContext} from "../../contextApi/Contexts/socket" */
//import { SocketContext } from "../contextApi/Contexts/socket";

import { useMediaSoupHelper } from "../lib/hooks/mediaSoupHelper";
//import { RoomManger } from "../lib/hooks/roomMangerHelper";
import { useRoomManger } from "../lib/hooks/roomMangerHelper";
import { ToastContainer, toast } from "react-toastify";
//import { useLocation, useParams } from "react-router-dom";
import Layout from "../Componant/layout/Layout";
import ControlePanle from "../Componant/layout/ControlePanle";
import VideoCards from "../Componant/layout/VideoCards";
import { AppContext } from "../contextApi/Contexts/AppContext";

function CallBord() {
  const { mediaSoupstate, roomState } = useContext(AppContext);
  const { device , params} = mediaSoupstate;
  const { userTrack, adminId } = roomState;

  const { startStreming } = useMediaSoupHelper();

  const { CreateOrJoinTheRoom } = useRoomManger( startStreming);

  useEffect(() => {
    console.log("TEST THE VAL");
    console.log(device, userTrack, adminId , params);

    if (userTrack && !adminId) CreateOrJoinTheRoom();
  }, [userTrack, adminId]);

  return (
    <Layout>
      <ToastContainer />

      <ControlePanle></ControlePanle>

      <VideoCards
      /*   GetElemntCssClass={GetElemntCssClass}
        setChatMessage={setChatMessage}
        IsVedioElemntVisble={IsVedioElemntVisble}
        ToogleBox={ToogleBox}
        First={First}
        ChatMessage={ChatMessage}
        HistoryChat={HistoryChat}
        ToggleElementCssClass={ToggleElementCssClass}
        guest={guest} */
      ></VideoCards>
      {/* 

      {guest.map((Guest, index) => (
        <Modal
          key={index}
          admin={First}
          Id={Guest}
          KikHimOut={KikHimOut}
          ToogleBox={ToogleBox}
          PrivetMessage={PrivetMessage}
          SendPrivetMessage={SendPrivetMessage}
          setPrivetMessage={setPrivetMessage}
        ></Modal>
      ))} */}
    </Layout>
  );
}

export default CallBord;
