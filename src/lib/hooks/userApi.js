import { useState, useEffect } from 'react';

import { io } from "socket.io-client";



export const useUserApi = () => {

  const [Socket,setSocket] = useState();
  const [SocketId,setSocketId] = useState(null);
  const connectToServer = async ()=> {

      const newSocket = await io(`http://localhost:6800`);
       
      setSocket(newSocket);
      
     newSocket.on('connect',()=>{ 
      setSocketId(newSocket.id)
        console.log("CONNECTINGED HOOKS")
       })

    }

    useEffect( ()=>{ 
      console.log('START USEUSERAPI USEEFFECT')

       // const newSocket = io(`http://localhost:6800`);
       connectToServer()
 
     // return () => Socket.close();

    },[setSocket])

  //  var csrf = async () => await fetcher({ url: "/sanctum/csrf-cookie", method: "GET" })

    return { Socket:Socket , SocketId:SocketId}

}