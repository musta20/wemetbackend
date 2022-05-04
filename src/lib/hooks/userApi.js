import { useState, useEffect } from 'react';
import   io  from "socket.io-client";


export const useUserApi = () => {

    let [Socket,setSocket] = useState();

    useEffect(()=>{ 
       // const newSocket = io(`http://localhost:6800`);
       const newSocket = io(`http://localhost:6800`);

      setSocket(newSocket);

      return () => Socket.close();
    },[setSocket])

  //  var csrf = async () => await fetcher({ url: "/sanctum/csrf-cookie", method: "GET" })

    return { Socket  }

}