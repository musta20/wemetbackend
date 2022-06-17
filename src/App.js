import React, { useReducer } from "react";
import "./assets/style/index.css";
import "bootstrap/dist/js/bootstrap";
import Body from "../src/pages/body"
import NavBar from "../src/Componant/layout/NavBar";
import CallBorad from "../src/pages/CallBord";
import "bootstrap/dist/css/bootstrap.css";
import "./assets/style/App.css";

import massengerReducer from "./contextApi/Reducers/massengerReducer";
import mediaSoupReducer from "./contextApi/Reducers/mediaSoupReducer";
import roomHelperReducer from "./contextApi/Reducers/roomHelperReducer";

import { SocketContext, socket } from "./contextApi/Contexts/socket";
import { AppContext } from "./contextApi/Contexts/AppContext";


import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {


/* const emptyUser ={
  id:0,
  feed:0
} */
  const initialMainRoomProps = {
    roomName: "",
    isPublic: true,
    isStreamed: true,
    adminId: 0,
    isJoinedTheRoom: false,
    userTrack:null,
    guestList: [{
      id:0,
      feed:0
    },{
      id:0,
      feed:0
    },{
      id:0,
      feed:0
    },{
      id:0,
      feed:0
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

 const MainRoomContex = {
  massengerstate,
  massengerDispatch,
  roomState,
  roomDispatch,
  mediaSoupstate,
  mediaSoupDispatch,
};




  return (
    <AppContext.Provider value={MainRoomContex}>
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <NavBar />

        <Routes>
          <Route path="/" element={<Body />}></Route>

          <Route path="CallBorad/:Room" element={<CallBorad />}></Route>
        </Routes>
      </BrowserRouter>
    </SocketContext.Provider>
  </AppContext.Provider>
  );
}

export default App;
