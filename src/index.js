import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/style/index.css";
import "bootstrap/dist/js/bootstrap";
import Body from "./Componant/body";
import NavBar from "./Componant/NavBar";
import CallBorad from "./Componant/CallBord";
import "bootstrap/dist/css/bootstrap.css";
import "./assets/style/App.css";

import { SocketContext, socket } from "./contextApi/Contexts/socket";
import { AppContext, MainRoomContex } from "./contextApi/Contexts/AppContext";


import { BrowserRouter, Routes, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
