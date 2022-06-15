import React, { useEffect, useRef, useState, useContext } from "react";
import Modal from "./Modal";
import { SocketContext } from "../contextApi/Contexts/socket";
import { useMediaSoupHelper } from "../lib/hooks/mediaSoupHelper";
import { RoomManger } from "../lib/hooks/roomMangerHelper";

import { ToastContainer, toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";
import Layout from "./layout/Layout";
import ControlePanle from "./layout/ControlePanle";
import VideoCards from "./layout/VideoCards";

function CallBord() {
  const CanvasImg = useRef(null);

  const Socket = useContext(SocketContext);

  const { Room } = useParams();

  const initialMainRoomProps = {
    roomName:"",
    isPublic: true,
    isStreamed:true,
    adminId:0,
    isJoinedTheRoom:false,
    guestList:[],
    isFreeToJoin:false

  }


const initialMediaSoupProps = {
  device:null,
  producerTransport:false,
  consumerTransports:[]

}

  const [MainRoom, seMainRoom] = useState({});
  const initialMassengerProps ={
    HistoryChat:[],
    ChatMessage:"",
    PrivetMessage:""

  }



  const [Case, setCase] = useState([
    true,
    false,
    false, //the curren case of the view
    false,
    false,
    false,
  ]);

  const [ChangeStatVale, setChangeStatVale] = useState([
    //the vlue of the css case classes
    [1, 0, 5, 4, 3, 2, 7, 6],
    [5, 2, 1, 7, 6, 0, 4, 3],
    [6, 7, 3, 2, 5, 4, 0, 1],
  ]);

  const view =
    //the array of class in each cases[
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

  const AddMediaStream = (userid, stream, kok) => {
    let guestlist = [...guest];

    for (let i = 1; i < guestlist.length; i++) {
      if (userid === BossId) {
        guestlist[0][0].current.srcObject = stream;
        guestlist[0][1] = userid;

        if (IsViewer) break;

        for (let i = 1; i < guestlist.length; i++) {
          if (guestlist[i][1] === 0) {
            guestlist[i][1] = Socket.id;

            if (!IsViewer) {
              StartUserCamra(i);
            }
            ShowTheSideCaller(i);
            break;
          }
        }
        break;
      }

      if (guestlist[i][1] === 0) {
        guestlist[i][0].current.srcObject = stream;
        guestlist[i][1] = userid;
        ShowTheSideCaller(i);
        break;
      }
    }

    setGuest(guestlist);
  };

  //this function called when user quit the room
  // it will clear his postion it the guist list
  // and close the side bar
  const completeSession = (id) => {
    let guestList = [...guest];

    let thegustid;

    guestList.forEach((geist, i) => {
      if (geist[1] === id) {
        console.log(i);
        geist[1] = 0;
        thegustid = i;
      }
    });

    setGuest(guestList);
    CloseTheSideCaller(thegustid);
  };

  const { startStreming, params, setParam } = useMediaSoupHelper(
    Socket,
    IsViewer,
    Room,
    setisFreeToJoin,
    AddMediaStream,
    completeSession
  );

  const {
    
  } = useRoomManger(
  
  );


  return (
    <Layout>
      <ToastContainer />
      <canvas
        ref={CanvasImg}
        className="d-none"
        width="280"
        height="200"
        id="canvas"
      ></canvas>

      <ControlePanle
        IsViewer={IsViewer}
        isFreeToJoin={isFreeToJoin}
        JoinTheRoom={JoinTheRoom}
        LockRoom={LockRoom}
        Lock={Lock}
        doHiddeTheRoom={doHiddeTheRoom}
        HiddeTheRoom={HiddeTheRoom}
        IsStream={IsStream}
        isStream={isStream}
        First={First}
      ></ControlePanle>

      <VideoCards
        GetElemntCssClass={GetElemntCssClass}
        setChatMessage={setChatMessage}
        IsVedioElemntVisble={IsVedioElemntVisble}
        ToogleBox={ToogleBox}
        First={First}
        SendMessageChat={SendMessageChat}
        ChatMessage={ChatMessage}
        HistoryChat={HistoryChat}
        ToggleElementCssClass={ToggleElementCssClass}
        guest={guest}
      ></VideoCards>

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
      ))}
    </Layout>
  );
}

export default CallBord;
