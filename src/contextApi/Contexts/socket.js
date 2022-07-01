
import   {io}  from "socket.io-client";

import React from 'react';

export const Socket = io("http://localhost:6800",{
    autoConnect: false
  });
//io(`http://localhost:6800`);
export const SocketContext = React.createContext();
/* 

export const connectSocketIo = async ()=>{
    await Socket.connect()
   }

   export const disConnectSocketIo = ()=>{
    Socket.disconnect()
   } */