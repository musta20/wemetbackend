import { useState, useEffect } from 'react';
import   io  from "socket.io-client";



export const useUserApi = () => {

    const [Socket,setSocket] = useState({});
    const connectToServer = async ()=> {

      const newSocket = await io(`http://localhost:6800`);
       
      setSocket(newSocket);
      
      newSocket.on('connect',()=>{
        console.log("CONNECTINGED HOOKS");
      })

    }

    useEffect( ()=>{ 
       // const newSocket = io(`http://localhost:6800`);
       connectToServer()
      return () => Socket.close();
    },[setSocket])

  //  var csrf = async () => await fetcher({ url: "/sanctum/csrf-cookie", method: "GET" })

    return { Socket:Socket }

}