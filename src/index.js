import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/style/index.css';
import "bootstrap/dist/js/bootstrap"
import Body from './Componant/body';
import NavBar from "./Componant/NavBar";
import CallBorad from "./Componant/CallBord";
//import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.css';
import "./assets/style/App.css"
 
import {SocketContext, socket} from "./context/socket"

//import Terms from "./Componant/Terms"
//import Guidelines from './Componant/Guidelines';
//import Privacy from './Componant/Privacy';
//import Switcher from "./Componant/Switcher"
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
  <BrowserRouter>
  
  <SocketContext.Provider value={socket}> <NavBar></NavBar>  </SocketContext.Provider>

    <Routes>
    
   


    <Route path="/" element={ <SocketContext.Provider value={socket}>  <Body />  </SocketContext.Provider>}></Route>
    <Route path="CallBorad/:room" element={ <SocketContext.Provider value={socket}>  <CallBorad />  </SocketContext.Provider> }>
           
          </Route>
</Routes>
</BrowserRouter>

  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
