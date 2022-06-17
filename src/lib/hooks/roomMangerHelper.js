import { AppContext } from "../../contextApi/Contexts/AppContext";
import { useLocation , useParams} from "react-router-dom";

import { useContext , useEffect} from "react";
import {
  setParam,
  setDevice,
  deleteDevice,
  addProducerTransport,
  removeProducerTransport,
  addConsumerTransport,
  removeConsumerTransport,
} from "../../contextApi/Actions/mediaSoupAction";

import {
  removeFromGuestList,
  addToGuestList,
  setRoomName,
  isRoomPublic,
  isRoomStream,
  upDateGuestList,
  setAdminId,
  setUserMedia,
  isJoinedTheRoom,
} from "../../contextApi/Actions/roomHelperAction";
import {SocketContext} from "../../contextApi/Contexts/socket"





//setUserMedia
export const useRoomManger = (startStreming) => {
  const navigate = useLocation();

  const { mediaSoupstate, mediaSoupDispatch, roomState, roomDispatch } =
    useContext(AppContext);
    
    
    const {roomName , isPublic , isStreamed, adminId , isJoinedTheRoom , guestList} = roomState
    const {params} = mediaSoupstate

    const Socket = useContext(SocketContext);
    const { Room } = useParams();

  useEffect(() => {
    if (Socket) startConncting();

   // return () => componentWillUnmount();
  }, []);

  //this function will show the notftion
  const showTost = (data) => {
 //   toast(data);
  };

  //open or close the dilog for a selected user
  //identfi the user that clicked on and safe the state
  //of the box
  const ToogleBox = (guest) => {
    let Guests = [...guest];
    let index = guest.indexOf(guest);

    if (guest[2]) {
      Guests[index][2] = false;
      upDateGuestList(Guests);
    } else {
      Guests[index][2] = true;
      upDateGuestList(Guests);
    }
  };



  /*
  this function is gone take the room name that 
  passed in the param and send it to the server 
  if you pass is viewer as true that mean you just 
  gone whatch the stream. else if the room excist try to join it 
  if not create it and you will resive the frist as true
  and set you as the room admin .
  if the room is full you just gone watch ti
  ---------------------------------------------------------
  upon reseving the rtpCapabilities creat a device 
  if viewer set as true will not  create send transport 
  and just resice any new procuser the server send 
  */

  const CreateOrJoinTheRoom = () => {
    let IsPublic = true;
    let IsViewer = false;

    if (navigate?.state?.IsViewer) {
      // setIsViewer(true);
      isJoinedTheRoom(false,roomDispatch);
      IsViewer = true;
    }

    if (!navigate?.state?.IsPublic) {
      isRoomPublic(true,roomDispatch);
      IsPublic = true;
    }

    //create room name it this way to add mor info in in the room name
    const FullRoomName = {
      title:Room,
      IsPublic:IsPublic,
      IsViewer:IsViewer
    };
    Socket.emit(
      "CreateStream",
      FullRoomName,
      ({ status, rtpCapabilities, BossId, room, First }) => {
        console.log({ status, rtpCapabilities, BossId, room, First })

        if (!status) {
          //if status came with wrong result and rtpCapabilities
          // that mean you just gone watch  the room
          if (rtpCapabilities) {
            showTost(room);
            setAdminId(BossId, roomDispatch);

            isJoinedTheRoom(false, roomDispatch);

            // once we have rtpCapabilities from the Router, create Device
            startStreming(rtpCapabilities);

            return;
          }
          // if error happen quit the app and got to home page
          setTimeout(function () {
            showTost("The room is not strmed");
            //  document.location.href = "/"
          }, 2000);
          return;
        }

        //if this value came as true you are the admin of this room

        if (First) {
          console.log("setting The Frist VALUE :::::::::::");
          console.log(First);
          //  setFirst(true);
          console.log(Socket.id)
          setAdminId(Socket.id, roomDispatch);

         
          //  setHiddeTheRoom( IsPublic )
        } else {
          setAdminId(BossId, roomDispatch);
        }

        showTost(room);
        startStreming(rtpCapabilities);
      }
    );

    //this event triggerd to notify you there is chance to join the room

    Socket.on("FreeToJoin", ({ status }) => {
      if (status) {
     //   setisFreeToJoin(true);

        return;
      }

     // setisFreeToJoin(false);
    });

    //this event triggerd when the room admin ban you from the room
    Socket.on("GoOut", () => {
      showTost("the admin drop you from this room");
      setTimeout(function () {
        document.location.href = "/";
      }, 200);
    });

    //this event triggred when you becam admin and the room setting seted
    Socket.on("switchAdminSetting", ({ isRoomLocked, isStream, IsPublic }) => {
      isRoomPublic(isRoomLocked, roomDispatch);
      isRoomStream(isStream, roomDispatch);
    });

    //this event triggred when admin switch to another youser
    Socket.on("switchAdmin", ({ admin }) => {
      setAdminId(admin, roomDispatch);

      // if you are the new admin set you as admin
      /*    if (admin === Socket.id) {
        setFirst(true);
      } */
      /* 
      find the new admin in the room and set
      his view to the big view and clear his 
      postion in the guest list
      */
      let UsersGuest = [...guestList];
      let posthion;

      UsersGuest.forEach((User) => {
        if (User[1] === adminId) {
          UsersGuest[0][0].current.srcObject = User[0].current.srcObject;
          UsersGuest[0][1] = adminId;
          posthion = UsersGuest.indexOf(User);
          User[1] = 0;
        }
      });

      upDateGuestList(UsersGuest);
      
      CloseTheSideCaller(posthion);
    });

    //this event triggerd when you recive a privet message
    //it will save to HistoryChat
/*     Socket.on("PrivetMessage", function (Message) {
      let HistoryChat = [...HistoryChat];

      HistoryChat.push(<div className="alr messageitem ">{Message}</div>);

      setHistoryChat(HistoryChat);
    }); */

    //this event triggerd when you recive a  message
    //it will save to HistoryChat
/*     Socket.on("Message", function (Message) {
      let HistoryChat = [...HistoryChat];

      HistoryChat.push(
        <div className="alr messageitem ">{Message.Message}</div>
      );

      setHistoryChat(HistoryChat);
    }); */
  };


  const componentWillUnmount = () => {
    console.log("Leving this component");
    try {
      //when leave the page close the cam
      let newgist = [...guestList];

     // console.log(guest);
      newgist.forEach((guest) => {
        if (guest[1] !== 0) {
          guest[0].current.srcObject.getVideoTracks().forEach((track) => {
            console.log(track);

            track.stop();
          });
        }
      });

      upDateGuestList(newgist);
    } catch (e) {
      console.log(e);
    }
  };

  //this check if the id if 0 it visible
  const IsVedioElemntVisble = (id) => {
    if (id === 0) return false;

    return true;
  };

  //this function will start accessing the webcam
  //and make it avalbe if the user is viewer will not connect to
  // to the server if not will connect to the server and
  const StartUserCamra = (i) => {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
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

              //   var guestList = [...guest];

              //userTrack
        if (Socket.id) {
          console.log(Socket.id);
          guestList[0].id=Socket.id
          setUserMedia(stream,roomDispatch)

        }/* 
        guestList[0].feed.current.srcObject = stream;

       // upDateGuestList(guestList); 
        if (i === 0) {

          CreateOrJoinTheRoom();
        }  */
        //whait a bit to let the cam load and then
        //take a ThumbnailImage if the user is admin
      })

      .catch(function (err) {
        console.log("An error occurred: " + err);
      });
  };


  //this function will prevent the roomfrom streaming to the public
  // the server will check if you are the admin
  const isStream = (e) => {
    //setisStream(e.target.checked);
    isRoomStream(e.target.checked,mediaSoupDispatch)
    Socket.emit("isStream", isStream, (data) => {});
  };


  //this function will ban a spesifc user apssed
  // to it the server will check if you are the admin
  const KikHimOut = (socketid) => {
    let guest = guest.find((geust, i) => geust[1] === socketid);
    ToogleBox(guest);
    Socket.emit("kik", socketid, (data) => {});
  };

  //this function wil just go
  // to the same page to allow the user
  // to join this room
  const JoinTheRoom = () => {
    navigate({
      pathname: "/Switch",
      state: {
        IsPublic: false,
        IsViewer: false,
        CallBorad: true,
        TheRoom: Room,
      },
    });
  };
  /*
  this function will add the stream of users 
  and display it and if the user comming is admin
  it will put it in the main view
  */

  //this function will will show the messages from the state
  const ShowHistoryChat = () => {
   // return HistoryChat.forEach((m) => <div> {m}</div>);
  };

  //this function will close the side bar when no active view in it
  const CloseTheSideCaller = (i) => {
/*     if ((i === 1 || i === 2) && guest[1][1] === 0 && guest[2][1] === 0) {
      ToggleElementCssClass(1);
    }

    if ((i === 3 || i === 4) && guest[3][1] === 0 && guest[4][1] === 0) {
      ToggleElementCssClass(2);
    } */
  };

  // this function will get the css class from view depnd on the current case
  const GetElemntCssClass = (Postion) => {
 //   return view[Postion][Case.indexOf(true)];
  };

  //this function will open the side bar when there is active view in it
  const ShowTheSideCaller = (i) => {
/*     if (i !== 0) {
      let iscase = Case.indexOf(true);
      if ((i === 1 || i === 2) && ![2, 3, 4, 5].includes(iscase)) {
        ToggleElementCssClass(1);
      }

      if ((i === 3 || i === 4) && ![3, 4, 6, 7].includes(iscase)) {
        ToggleElementCssClass(2);
      }
    } */
  };

  //this fuction will check the css cass and
  //toggle it to its oppessit case in the cases arry
  const ToggleElementCssClass = (i) => {
   /*  let stv = Case.indexOf(true);

    let nev = ChangeStatVale[i][stv];

    let cc = [...Case];

    cc[stv] = false;
    cc[nev] = true;
    setCase(cc); */
  };

  //this function will connecect the socketio server
  // and save some initail date to the state
  // this function shuld run after the component have mounted
  const startConncting = () => {
    //set all css view cases the false excpit the frist one

    /*     let CaseEditer = [...Case];
    Case.forEach((c, i) => {
      CaseEditer[i] = false;
      if (i === 0) CaseEditer[i] = true;
    });

    setCase(CaseEditer); */

    /*     let GuestEditer = [...guest];
    guest.forEach((g, i) => {
      GuestEditer[i][0] = React.createRef();
      GuestEditer[i][1] = 0;
      GuestEditer[i][2] = true;
    });

    upDateGuestList(GuestEditer);
 */
    //if the isviewer came as true dont run the cam
    //star connection to the server to watch the stream
    if (navigate?.state?.IsViewe) {
      CreateOrJoinTheRoom();
      return;
    }

    StartUserCamra(0);
  };

  return {CreateOrJoinTheRoom};
};
