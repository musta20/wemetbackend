import React, { useEffect, useRef, useState, useContext } from "react";
import Modal from "./Modal";
import { SocketContext } from "../context/socket";
import { useMediaSoupHelper } from "../lib/mediaSoupHelper";

import Footer from "./Footer";

import { ToastContainer, toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";
import Layout from "./layout/Layout";
import ControlePanle from "./layout/ControlePanle";
import VideoCards from "./layout/VideoCards";

function CallBord() {
  const CanvasImg = useRef(null);

  const Socket = useContext(SocketContext);

  const { Room } = useParams();

  const [isFreeToJoin, setisFreeToJoin] = useState(false);
  const [HiddeTheRoom, setHiddeTheRoom] = useState(true);
  const [Lock, setLock] = useState(false);
  const [Connected, setConnected] = useState(false);
  const [IsViewer, setIsViewer] = useState(false);
  const [IsPublic, setIsPublic] = useState(false);
  const [IsStream, setisStream] = useState(false);
  const [BossId, setBossId] = useState(0);
  const [HistoryChat, setHistoryChat] = useState([]);
  const [guest, setGuest] = useState([[], [], [], [], []]);
  const [ChatMessage, setChatMessage] = useState("");
  const [PrivetMessage, setPrivetMessage] = useState("");
  const [First, setFirst] = useState(false);
  const [Case, setCase] = useState([
    true,
    false,
    false, //the curren case of the view
    false,
    false,
    false,
  ]);

  const [ChangeStatVale, setChangeStatVale] = useState([
    //the vlue of the css case classes
    [1, 0, 5, 4, 3, 2, 7, 6],
    [5, 2, 1, 7, 6, 0, 4, 3],
    [6, 7, 3, 2, 5, 4, 0, 1],
  ]);

  const view =
    //the array of class in each cases[
    [
      [
        "d-none",
        "col-md-6",
        "col-md-4",
        "col-md-4",
        "d-none",
        "d-none",
        "d-none",
        "col-md-4",
      ],
      [
        "d-none",
        "d-none",
        "col-md-3",
        "col-md-2",
        "col-md-3",
        "col-md-4",
        "d-none,d-none",
      ],
      [
        "col-md-7",
        "col-md-6",
        "col-md-5",
        "col-md-4",
        "col-md-6",
        "col-md-6",
        "col-md-6",
        "col-md-5",
      ],
      [
        "d-none",
        "d-none",
        "d-none",
        "col-md-2",
        "col-md-3",
        "d-none",
        "col-md-4",
        "col-md-3",
      ],
    ];

  const AddMediaStream = (userid, stream, kok) => {
    let guestlist = [...guest];

    for (let i = 1; i < guestlist.length; i++) {
      if (userid === BossId) {
        guestlist[0][0].current.srcObject = stream;
        guestlist[0][1] = userid;

        if (IsViewer) break;

        for (let i = 1; i < guestlist.length; i++) {
          if (guestlist[i][1] === 0) {
            guestlist[i][1] = Socket.id;

            if (!IsViewer) {
              StartUserCamra(i);
            }
            ShowTheSideCaller(i);
            break;
          }
        }
        break;
      }

      if (guestlist[i][1] === 0) {
        guestlist[i][0].current.srcObject = stream;
        guestlist[i][1] = userid;
        ShowTheSideCaller(i);
        break;
      }
    }

    setGuest(guestlist);
  };

    //this function called when user quit the room
  // it will clear his postion it the guist list
  // and close the side bar
  const completeSession = (id) => {
    let guestList = [...guest];

    let thegustid;

    guestList.forEach((geist, i) => {
      if (geist[1] === id) {
        console.log(i);
        geist[1] = 0;
        thegustid = i;
      }
    });

    setGuest(guestList);
    CloseTheSideCaller(thegustid);
  };

  const { startStreming, params, setParam } = useMediaSoupHelper(
    Socket,
    IsViewer,
    Room,
    setisFreeToJoin,
    AddMediaStream,
    completeSession
  );

  const navigate = useLocation();

  //this function will show the notftion
  const showTost = (data) => {
    toast(data);
  };

  //open or close the dilog for a selected user
  //identfi the user that clicked on and safe the state
  //of the box
  const ToogleBox = (guest) => {
    let Guests = [...guest];
    let index = guest.indexOf(guest);

    if (guest[2]) {
      Guests[index][2] = false;
      setGuest(Guests);
    } else {
      Guests[index][2] = true;
      setGuest(Guests);
    }
  };

  /*
  send a Privet message to user
  check if the input is empty and add it 
  to HistoryChat savet to the state empty the 
  chat box and send it to the server
  */
  const SendPrivetMessage = (e) => {
    e.preventDefault();
    if (PrivetMessage.trim() === "") return;

    let HistoryChat = [...HistoryChat];
    HistoryChat.push(<div className=" messageitem ">{PrivetMessage}</div>);
    setHistoryChat(HistoryChat);
    setPrivetMessage("");
    Socket.emit(
      "SendPrivetMessage",
      { id: e.target.id, Message: PrivetMessage },
      (room) => {
        console.log(room);
      }
    );
  };

  /*
  send message to public chat board
  check if the input is empty and add it 
  to HistoryChat savet to the state empty the 
  chat box and send it to the server
  */
  const SendMessageChat = (e) => {
    e.preventDefault();
    if (ChatMessage.trim() === "") return;

    let HistoryChat = [...HistoryChat];
    HistoryChat.push(<div className=" messageitem ">{ChatMessage}</div>);
    setHistoryChat(HistoryChat);
    setChatMessage("");
    Socket.emit("Message", '{"title":"' + Room + '"}', ChatMessage);
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
        setIsViewer(true);
        IsViewer = true;
      }

      if (!navigate?.state?.IsPublic) {
        setIsPublic(true);
        IsPublic = true;
      }
   

    //create room name it this way to add mor info in in the room name
    let FullRoomName =
      '{"title":"' +
      Room +
      '","IsPublic":' +
      IsPublic +
      ',"IsViewer":' +
      IsViewer +
      "}";


      Socket.emit(
        "CreateStream",
        FullRoomName,
        ({ status, rtpCapabilities, BossId, room, First }) => {
          if (!status) {
            //if status came with wrong result and rtpCapabilities
            // that mean you just gone watch  the room
            if (rtpCapabilities) {
              showTost(room);
              setBossId(BossId);

              setIsViewer(true);

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
            setFirst(true);
            setBossId(Socket.id);

            setTimeout(() => {
              console.log(First);

              TakeThumbnailImage();
            }, 700);

            //  setHiddeTheRoom( IsPublic )
          } else {
            setBossId(BossId);
          }

          showTost(room);
          startStreming(rtpCapabilities);
        }
      );
  

    //this event triggerd to notify you there is chance to join the room

    Socket.on("FreeToJoin", ({ status }) => {
      if (status) {
        setisFreeToJoin(true);
        return;
      }

      setisFreeToJoin(false);
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
      setLock(isRoomLocked);
      setisStream(isStream);
      setHiddeTheRoom(IsPublic);
    });

    //this event triggred when admin switch to another youser
    Socket.on("switchAdmin", ({ admin }) => {
      setBossId(admin);

      // if you are the new admin set you as admin
      if (admin === Socket.id) {
        setFirst(true);
      }
      /* 
      find the new admin in the room and set
      his view to the big view and clear his 
      postion in the guest list
      */
      let UsersGuest = [...guest];
      let posthion;
      UsersGuest.forEach((User) => {
        if (User[1] === BossId) {
          UsersGuest[0][0].current.srcObject = User[0].current.srcObject;
          UsersGuest[0][1] = BossId;
          posthion = UsersGuest.indexOf(User);
          User[1] = 0;
        }
      });

      setGuest(UsersGuest);
      CloseTheSideCaller(posthion);
    });

    //this event triggerd when you recive a privet message
    //it will save to HistoryChat
    Socket.on("PrivetMessage", function (Message) {
      let HistoryChat = [...HistoryChat];

      HistoryChat.push(<div className="alr messageitem ">{Message}</div>);

      setHistoryChat(HistoryChat);
    });

    //this event triggerd when you recive a  message
    //it will save to HistoryChat
    Socket.on("Message", function (Message) {
      let HistoryChat = [...HistoryChat];

      HistoryChat.push(
        <div className="alr messageitem ">{Message.Message}</div>
      );

      setHistoryChat(HistoryChat);
    });
  };

  //this function take small imge from the user video
  // and send it to the server as a thumnail imge
  const TakeThumbnailImage = () => {
    var context = CanvasImg.current.getContext("2d");

    context.drawImage(guest[0][0].current, 0, 0, 280, 200);

    var data = CanvasImg.current.toDataURL("image/png", 0.1);
    console.log("IMGE EMITED TO SERVER ");

    Socket.emit("saveimg", data, (data) => {
      console.log("IMGE EMITED TO SERVER ");
    });
  };

  const componentWillUnmount = () => {
    
    console.log('Leving this component');
    try {
      //when leave the page close the cam 
      let newgist = [...guest]

      console.log(guest)
      newgist.forEach(guest => {

        if (guest[1] !== 0) {
          
          guest[0].current.srcObject.getVideoTracks().forEach(track => {
            console.log(track)

            track.stop()
          })
        }

      })

      setGuest( newgist )

    } catch (e) {

      console.log(e)

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
        setParam(Params);

        var guestList = [...guest];
        if (Socket.id) {
          console.log(Socket.id);

          guestList[i][1] = Socket.id;
        }
        guestList[i][0].current.srcObject = stream;

        setGuest(guestList);
        if (i === 0) {
          CreateOrJoinTheRoom();
        }
        //whait a bit to let the cam load and then
        //take a ThumbnailImage if the user is admin
        console.log(First);
      })

      .catch(function (err) {
        console.log("An error occurred: " + err);
      });
  };

  //this function will lock the room
  // the server will check if you are the admin
  const LockRoom = (e) => {
    setLock(e.target.checked);
    Socket.emit("LockTheRoom", Lock, (data) => {});
  };

  //this function will prevent the roomfrom streaming to the public
  // the server will check if you are the admin
  const isStream = (e) => {
    setisStream(e.target.checked);
    Socket.emit("isStream", isStream, (data) => {});
  };

  //this function will hide the room
  // the server will check if you are the admin
  const doHiddeTheRoom = (e) => {
    setHiddeTheRoom(e.target.checked);
    Socket.emit("HiddeTheRoom", Lock, (data) => {});
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
    return HistoryChat.forEach((m) => <div> {m}</div>);
  };

  //this function will close the side bar when no active view in it
  const CloseTheSideCaller = (i) => {
    if ((i === 1 || i === 2) && guest[1][1] === 0 && guest[2][1] === 0) {
      ToggleElementCssClass(1);
    }

    if ((i === 3 || i === 4) && guest[3][1] === 0 && guest[4][1] === 0) {
      ToggleElementCssClass(2);
    }
  };

  // this function will get the css class from view depnd on the current case
  const GetElemntCssClass = (Postion) => {
    return view[Postion][Case.indexOf(true)];
  };

  //this function will open the side bar when there is active view in it
  const ShowTheSideCaller = (i) => {
    if (i !== 0) {
      let iscase = Case.indexOf(true);
      if ((i === 1 || i === 2) && ![2, 3, 4, 5].includes(iscase)) {
        ToggleElementCssClass(1);
      }

      if ((i === 3 || i === 4) && ![3, 4, 6, 7].includes(iscase)) {
        ToggleElementCssClass(2);
      }
    }
  };

  //this fuction will check the css cass and
  //toggle it to its oppessit case in the cases arry
  const ToggleElementCssClass = (i) => {
    let stv = Case.indexOf(true);

    let nev = ChangeStatVale[i][stv];

    let cc = [...Case];

    cc[stv] = false;
    cc[nev] = true;
    setCase(cc);
  };



  //this function will connecect the socketio server
  // and save some initail date to the state
  // this function shuld run after the component have mounted
  const startConncting = () => {
    //set all css view cases the false excpit the frist one

    let CaseEditer = [...Case];
    Case.forEach((c, i) => {
      CaseEditer[i] = false;
      if (i === 0) CaseEditer[i] = true;
    });

    setCase(CaseEditer);

    let GuestEditer = [...guest];
    guest.forEach((g, i) => {
      GuestEditer[i][0] = React.createRef();
      GuestEditer[i][1] = 0;
      GuestEditer[i][2] = true;
    });

    setGuest(GuestEditer);

    //if the isviewer came as true dont run the cam
    //star connection to the server to watch the stream
    if (navigate?.state?.IsViewe) {
      CreateOrJoinTheRoom();
      return;
    }

    StartUserCamra(0);
  };

  useEffect(() => {
    if (Socket) startConncting();

    return () => componentWillUnmount();
  }, []);

  return (
    <Layout>
            <ToastContainer />
            <canvas ref={CanvasImg} className='d-none' width='280' height='200' id="canvas"></canvas>

      <ControlePanle
        IsViewer={IsViewer}
        isFreeToJoin={isFreeToJoin}
        JoinTheRoom={JoinTheRoom}
        LockRoom={LockRoom}
        Lock={Lock}
        doHiddeTheRoom={doHiddeTheRoom}
        HiddeTheRoom={HiddeTheRoom}
        IsStream={IsStream}
        isStream={isStream}
        First={First}
      ></ControlePanle>

              
              <VideoCards
                GetElemntCssClass={GetElemntCssClass}
                setChatMessage={setChatMessage}
                IsVedioElemntVisble={IsVedioElemntVisble}
                ToogleBox={ToogleBox}
                First={First}
                SendMessageChat={SendMessageChat}
                ChatMessage={ChatMessage}
                HistoryChat={HistoryChat}
                ToggleElementCssClass={ToggleElementCssClass}
                guest={guest}>

                </VideoCards>

      {guest.map((Guest, index) => (
        <Modal
        key={index}
          admin={First}
          Id={Guest}
          KikHimOut={KikHimOut}
          ToogleBox={ToogleBox}
          PrivetMessage={PrivetMessage}
          SendPrivetMessage={SendPrivetMessage}
          setPrivetMessage={setPrivetMessage}
        ></Modal>
      ))}
    </Layout>
  );
}

export default CallBord;
