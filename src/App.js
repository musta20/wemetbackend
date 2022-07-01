import React, { useReducer, useRef } from "react";
import "./assets/style/index.css";
import "bootstrap/dist/js/bootstrap";
import Body from "../src/pages/body"
import NavBar from "../src/Componant/layout/NavBar";
import CallBorad from "../src/pages/CallBord";
import Switcher from "../src/Componant/Switcher";
import "bootstrap/dist/css/bootstrap.css";
import "./assets/style/App.css";

import {restMediaSoupState} from "./contextApi/Actions/mediaSoupAction";
import {restChatState} from "./contextApi/Actions/massengerHelperAction";
import {restRoomState} from "./contextApi/Actions/roomHelperAction";

import massengerReducer from "./contextApi/Reducers/massengerReducer";
import mediaSoupReducer from "./contextApi/Reducers/mediaSoupReducer";
import roomHelperReducer from "./contextApi/Reducers/roomHelperReducer";

import { SocketContext, Socket  } from "./contextApi/Contexts/socket";
import { AppContext } from "./contextApi/Contexts/AppContext";

//{ SocketContext, socket ,connectSocketIo , disConnectSocketIo }
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {



  const initialMainRoomProps = {
    roomName: "",
    isPublic: true,
    userMediaTrack:null,
    isFreeToJoin:false,
    isStreamed: true,
    adminId: 0,
    isAudience: false,
    
    guestList: [{
      id:0,
      feed:useRef(null)
    },{
      id:0,
      feed:useRef(null)
    },{
      id:0,
      feed:useRef(null)
    },{
      id:0,
      feed:useRef(null)
    }],
  };


  const initialMassengerProps = {
    HistoryChat: [],
    ChatMessage: "",
    PrivetMessage: "",
  };

  
  const initialMediaSoupProps = {
    device: null,
    producerTransport: false,
    consumerTransports: [],
    params:{
      // mediasoup configratio params
      encodings: [
        {
          rid: "r0",
          maxBitrate: 100000,
          scalabilityMode: "S1T3",
        },
        {
          rid: "r1",
          maxBitrate: 300000,
          scalabilityMode: "S1T3",
        },
        {
          rid: "r2",
          maxBitrate: 900000,
          scalabilityMode: "S1T3",
        },
      ],
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
      codecOptions: {
        videoGoogleStartBitrate: 1000,
      },
    }
  };


const [roomState, roomDispatch] = useReducer(
  roomHelperReducer,
  initialMainRoomProps
);
const [mediaSoupstate, mediaSoupDispatch] = useReducer(
  mediaSoupReducer,
  initialMediaSoupProps
);
const [massengerstate, massengerDispatch] = useReducer(
  massengerReducer,
  initialMassengerProps
);

const restAllState =()=>{
  console.log("REST ALL DATA REST ALL DATA TO INIAL STATE SEE IF IT WORK")
  restRoomState(initialMainRoomProps,roomDispatch);
  restChatState(initialMassengerProps,massengerDispatch);
  restMediaSoupState(initialMediaSoupProps,mediaSoupDispatch);
}

 const MainRoomContex = {
  massengerstate,
  massengerDispatch,
  roomState,
  roomDispatch,
  mediaSoupstate,
  mediaSoupDispatch,
  restAllState
};

//Socket , connectSocketIo , disConnectSocketIo]

//const socketValue = {}
  return (
    <AppContext.Provider value={MainRoomContex}>
    <SocketContext.Provider value={Socket}>
      <BrowserRouter>
        <NavBar />

        <Routes>
          <Route path="/" element={<Body />}></Route>

          <Route path="CallBorad/:Room" element={<CallBorad />}></Route>
          <Route path="Switcher/" element={<Switcher />}></Route>
        </Routes>
      </BrowserRouter>
    </SocketContext.Provider>
  </AppContext.Provider>
  );
}

export default App;
