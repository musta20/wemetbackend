import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SocketContext } from "../contextApi/Contexts/socket";

export default function Switcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const Socket = useContext(SocketContext);

  const connectToServer = async () => {
    if (!Socket.connected) {
      await Socket.connect();
      console.log('HERE ALL THE CONRIDAL')
   
    }
  };

  useEffect(() => {
    
    connectToServer();
    Socket.off('connect').on('connect',()=>{
      navigate("/CallBorad/" + location?.state?.roomName, {
        state: {
          IsPublic: true,
          IsViewer: false,
        },
      });
    })
 
    
  }, []);

  return (
    <>
      <span>loadin</span>
    </>
  );
}
