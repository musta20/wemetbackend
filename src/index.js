import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/style/index.css';
//import Body from './Componant/body';
import NavBar from "./Componant/NavBar";
//import CallBorad from "./Componant/CallBord";
import "bootstrap/dist/css/bootstrap.min.css";
//import Terms from "./Componant/Terms"
//import Guidelines from './Componant/Guidelines';
//import Privacy from './Componant/Privacy';
//import Switcher from "./Componant/Switcher"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

<Router>
    <NavBar></NavBar>

    <Switch>     

    </Switch>
</Router>
   
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
