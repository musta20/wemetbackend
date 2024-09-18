import { AppContext } from "../../contextApi/Contexts/AppContext";
import { useLocation, useParams } from "react-router-dom";

import { useContext, useEffect } from "react";
import { setParam } from "../../contextApi/Actions/mediaSoupAction";
import { useToast } from '@chakra-ui/react'
import {
  setIsAudience,
  isRoomPublic,
  isRoomStream,
  upDateGuestList,
  setRoomName,
  setAdminId,
  setIsFreeToJoin,
  setUserMedia,
} from "../../contextApi/Actions/roomHelperAction";
import { SocketContext } from "../../contextApi/Contexts/socket";


export const useRoomManger = (startStreming) => {

  const toast = useToast()

  const navigate = useLocation();

  const { mediaSoupstate, mediaSoupDispatch, roomState, roomDispatch } =
    useContext(AppContext);

  const { guestList } = roomState;
  const { params } = mediaSoupstate;

  const Socket = useContext(SocketContext);
  const { Room } = useParams();

  useEffect(() => {
    setRoomName(Room, roomDispatch);
 
    if (Socket && !navigate?.state?.IsViewer) StartUserCamra(0);

   }, []);

  //this function will show the notftion
  const showTost = (data,status) => {
    //   toast(data);
    toast({
      title: data,
      position: "bottom",
      status: status,
      isClosable: true,
    })
  };



  /*
  this function is gone take the room name that 
  passed in the param and send it to the server 
  if you pass is viewer as true that mean you just 
  gone watch the stream. else if the room exist try to join it 
  if not create it and you will receive the first as true
  and set you as the room admin .
  if the room is full you just gone watch ti
  ---------------------------------------------------------
  upon receiving the rtpCapabilities create a device 
  if viewer set as true will not  create send transport 
  and just receive any new producer from the server send 
  */

  const CreateOrJoinTheRoom = () => {
    let IsPublic = true;
    let IsViewer = false;

    if (navigate?.state?.IsViewer) {

      setIsAudience(true, roomDispatch);
      IsViewer = true;
    }

    
    if (!navigate?.state?.IsPublic) {
      isRoomPublic(false, roomDispatch);
      IsPublic = false;
    }

    //create room name it this way to add mor info in in the room name
    const FullRoomName = {
      title: Room,
      IsPublic: IsPublic,
      IsViewer: IsViewer,
    };


    Socket.emit(
      "CreateStream",
      FullRoomName,
      ({ status, rtpCapabilities, BossId, room, First }) => {
        console.log({ status, rtpCapabilities, BossId, room });

        if (!status) {
          //if status came with wrong result and rtpCapabilities
          // that mean you just gone watch  the room
        
          if (rtpCapabilities) {

            setAdminId(BossId, roomDispatch);

            showTost(room,"info");
            
            setIsAudience(true, roomDispatch);
            
            startStreming(rtpCapabilities);

            // once we have rtpCapabilities from the Router, create Device

            return;
          }
          // if error happen quit the app and got to home page
          
          showTost("this room is not streamed by the admin","warning");

          setTimeout(function () {
              document.location.href = "/"
          }, 2000);

          return;
        }

        //if this value came as true you are the admin of this room

        if (First) {
      
          
          setAdminId(Socket.id, roomDispatch);
          showTost(`you created room : ${room}`,"success");

        } else {
          showTost(`you joined room : ${room}`,"success");

          setAdminId(BossId, roomDispatch);
        }

        startStreming(rtpCapabilities);
      }
    );

    //this event triggered to notify you there is chance to join the room

    Socket.on("FreeToJoin", ({ status }) => {
      if (status) {
        setIsFreeToJoin(true, roomDispatch);

        return;
      }

      setIsFreeToJoin(false, roomDispatch);
    });

    //this event triggered when the room admin ban you from the room
    Socket.on("GoOut", () => {
      showTost("the admin drop you from this room","info");
      setTimeout(function () {
        document.location.href = "/";
      }, 200);
    });

    //this event trigger when you become admin and the room setting 
    Socket.on("switchAdminSetting", ({ isRoomLocked, isStream, IsPublic }) => {

      
      setAdminId(Socket.id, roomDispatch);

      isRoomPublic(IsPublic, roomDispatch);
      isRoomStream(isStream, roomDispatch);
    });

    //this event trigger when admin switch to another user
    Socket.on("switchAdmin", ({ admin }) => {
      // if you are the new admin set you as admin
      /* 
      find the new admin in the room and set
      his view to the big view and clear his 
      position in the guest list
      */
      const copyUsersGuest = [...guestList];
      const currentUserIndx = copyUsersGuest.findIndex(
        (guest) => guest.id === admin
      );

    if(currentUserIndx){
      copyUsersGuest[0].feed.current.srcObject = copyUsersGuest[currentUserIndx].feed.current.srcObject;
      copyUsersGuest[0].id = admin;
      copyUsersGuest[currentUserIndx].feed.current.srcObject = null;
      copyUsersGuest[currentUserIndx].id = 0;
      setAdminId(admin, roomDispatch);
      upDateGuestList(copyUsersGuest, roomDispatch);

}
    });

    //this event trigger when you recive a privet message
    //it will save to HistoryChat

 
  };



  //this function will start accessing the webcam
  //and make it available if the user is viewer will not connect to
  // to the server if not will connect to the server and
  const StartUserCamra = (i) => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          width: {
            min: 640,
            max: 1920,
          },
          height: {
            min: 400,
            max: 1080,
          },
        },
      })
      .then((stream) => {
        let track = stream.getVideoTracks()[0];
        // let params = params
        let Params = {
          track,
          ...params,
        };

        setParam(Params, mediaSoupDispatch);

        if (Socket.id) {
          const copyGuesList = [...guestList];
          copyGuesList[0].id = Socket.id;
 

          setUserMedia(stream, roomDispatch);
     

          upDateGuestList(copyGuesList, roomDispatch);
        } 
        
      })

      .catch(function (err) {
        console.log("An error occurred: " + err);
      });
  };

  


  return { CreateOrJoinTheRoom };
};
