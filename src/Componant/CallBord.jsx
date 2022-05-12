import React, { useEffect, useRef, useState ,useContext ,useCallback} from 'react';
import Modal from './Modal';
import { Device } from 'mediasoup-client';
//import { SocketContext } from "../context/socket"

//import {io} from 'socket.io-client';


import Footer from './Footer';
import { useUserApi } from '../lib/hooks/userApi';



import { ToastContainer, toast } from 'react-toastify';
//import { useNavigate } from 'react-router-dom';
import { useLocation , useParams } from 'react-router-dom';

function  CallBord () {
  //const [Socket,setSocket] = useState({});



  const CanvasImg = useRef(null);
  const { Socket , SocketId} = useUserApi();
  //const Socket = useContext(SocketContext);

  const { Room } = useParams();

//const [socket,setsocket] = useState(null);
const [rtpCapabilities,setRtpCapabilities] = useState('');
                    
const [isFreeToJoin,setisFreeToJoin] = useState(false);
const [HiddeTheRoom,setHiddeTheRoom] = useState(true);
const [Lock,setLock] = useState(false);
const [device,setDevice] = useState(null);
const [IsViewer,setIsViewer] = useState(false);
const [IsStream,setisStream] = useState(false);
const [producerTransport,setproducerTransport] = useState(false);
const [consumerTransports,setConsumerTransports] = useState([]);
const [producer,setProducer] = useState(null);
const [BossId,setBossId] = useState(0);
const [HistoryChat,setHistoryChat] = useState([]);
const [guest,setGuest] = useState([[], [], [], [], []]);
const [ChatMessage,setChatMessage] = useState("");
const [PrivetMessage,setPrivetMessage] = useState("");
const [First,setFirst] = useState(false);
const [Case , setCase] = useState([true, false, false,    //the curren case of the view
false, false, false]) 

const createStreamCallBack =  ({ status, rtpCapabilities , BossId, room , First }) => {

  console.log("SHOW THE RESULT ")
  console.log(rtpCapabilities)
  console.log(BossId)
  console.log(room)
  console.log(First)

  if (!status) {
    //if status came with wrong result and rtpCapabilities
    // that mean you just gone watch  the room
    if (rtpCapabilities) {

      showTost(room);
      setBossId( BossId )

      setRtpCapabilities(rtpCapabilities )
      setIsViewer(true)

      // once we have rtpCapabilities from the Router, create Device
      createDevice()

      return
    }
    // if error happen quit the app and got to home page
    setTimeout(function () {
      showTost("The room is not strmed");
    //  document.location.href = "/"
    }, 2000);
    return
  }

  //if this value came as true you are the admin of this room
  try {
    let i =  Socket.id

  } catch (error) {
    console.log(error)
  }
  if (First) {
    setFirst(true)
    setBossId( Socket.id )
  //  setHiddeTheRoom( IsPublic )
  } else {
    setBossId( BossId )
  }

  showTost(room);
  setRtpCapabilities( rtpCapabilities )
  createDevice()
}

const connectToServer = async ()=> {

 // const newSocket = await io(`http://localhost:6800`);
   
 // setSocket(newSocket);
  
 //newSocket.on('connect',()=>{  console.log("CONNECTINGED HOOKS") })

}
const [ChangeStatVale,setChangeStatVale] = useState([             //the vlue of the css case classes
[1, 0, 5, 4, 3, 2, 7, 6],
[5, 2, 1, 7, 6, 0, 4, 3],
[6, 7, 3, 2, 5, 4, 0, 1]]);

const [view,setview] = useState( //the array of class in each cases[
 [ ['d-none', 'col-md-6', 'col-md-4', 'col-md-4', 'd-none', 'd-none', 'd-none', 'col-md-4'],
  ['d-none', 'd-none', 'col-md-3', 'col-md-2', 'col-md-3', 'col-md-4', 'd-none,d-none'],
  ['col-md-7', 'col-md-6', 'col-md-5', 'col-md-4', 'col-md-6', 'col-md-6', 'col-md-6', 'col-md-5'],
  ['d-none', 'd-none', 'd-none', 'col-md-2', 'col-md-3', 'd-none', 'col-md-4', 'col-md-3']]);

  const [params,setParam] = useState(
    {   // mediasoup configratio params 
    
      encodings: [
        {
          rid: 'r0',
          maxBitrate: 100000,
          scalabilityMode: 'S1T3',
        },
        {
          rid: 'r1',
          maxBitrate: 300000,
          scalabilityMode: 'S1T3',
        },
        {
          rid: 'r2',
          maxBitrate: 900000,
          scalabilityMode: 'S1T3',
        },
      ],
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
      codecOptions: {
        videoGoogleStartBitrate: 1000
      }
    }
    );

    const navigate = useLocation();

  
  //this function will show the notftion
 const showTost = (data)=> {
    toast(data)
  }

  //open or close the dilog for a selected user
  //identfi the user that clicked on and safe the state
  //of the box 
 const ToogleBox =(guest)=> {
    let Guests = [...guest]
    let index = guest.indexOf(guest)

    if (guest[2]) {
      Guests[index][2] = false
      setGuest(Guests)

    } else {
      Guests[index][2] = true
      setGuest(Guests)
    }

  }

  /*
  send a Privet message to user
  check if the input is empty and add it 
  to HistoryChat savet to the state empty the 
  chat box and send it to the server
  */
const  SendPrivetMessage =(e)=> {
    e.preventDefault();
    if (PrivetMessage.trim() === "") return

    let HistoryChat = [...HistoryChat]
    HistoryChat.push(<div className=" messageitem ">
      {PrivetMessage}</div>)
    setHistoryChat(HistoryChat);
    setPrivetMessage("")
    Socket.emit('SendPrivetMessage',
      { id: e.target.id, Message: PrivetMessage }, room => {
        console.log(room)
      }
    )
  }

  /*
  send message to public chat board
  check if the input is empty and add it 
  to HistoryChat savet to the state empty the 
  chat box and send it to the server
  */
  const SendMessageChat =(e) =>{
    e.preventDefault();
    if (ChatMessage.trim() === "") return

    let HistoryChat = [...HistoryChat]
    HistoryChat.push(<div className=" messageitem ">
      {ChatMessage}</div>)
    setHistoryChat(HistoryChat);
    setChatMessage("")
    Socket.emit('Message',
      '{"title":"' + Room + '"}',
      ChatMessage,
    )

  }

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

  const CreateOrJoinTheRoom=() =>{
    let IsViewer;
    let IsPublic = null;

    try {
      if (navigate .state.IsViewer) {
        IsViewer = true

      } else {
        IsViewer = false
      }
    } catch (e) {
      IsViewer = false

    }

    try {
      if (!navigate .state.IsPublic) {
        IsPublic = false;

      } else {
        IsPublic = true;

      }
    }
    catch (e) {
      IsPublic = true;

    }
console.log("THE ROOM TESTED FOR ")
console.log(Room)
    //create room name it this way to add mor info in in the room name    
    let FullRoomName = '{"title":"' + Room +
      '","IsPublic":' + IsPublic +
      ',"IsViewer":' + IsViewer + '}';
console.log(FullRoomName)
try {
  console.log(Socket)
  console.log("Socket");

  Socket.emit('CreateStream', FullRoomName , createStreamCallBack )

} catch (error) {
  console.log(error)
}

    //this event new-prouducer triggerd a new user is joined the room and 
    // you gone resive his stream via producerId and socketId is his socket id
    Socket.on('new-producer', async ({ producerId, socketId }) => {
     //console.log(queueGuest)
     //if(queueGuest[socketId]) return
     //setState({queueGuest:[...queueGuest,socketId]})
      await signalNewConsumerTransport(producerId, socketId)

    })
    //this event triggred when user colse his stram you shuld close 
    //the connection to prevent memory leak
    Socket.on('producer-closed', ({ remoteProducerId, socketId }) => {
      //find the specifc transport and close it
      try {
        const producerToClose = consumerTransports.find(transportData => transportData.producerId === remoteProducerId)
        producerToClose.consumerTransport.close()
        producerToClose.consumer.close()
      } catch (e) {
        console.error(e)
      }
      // remove the consumer transport from the list
      let consumerTransports = [...consumerTransports.filter(transportData => transportData.producerId !== remoteProducerId)]
      setConsumerTransports( consumerTransports )
      // hide the video div element
      completeSession(socketId)

    })

    //this event triggerd to notify you there is chance to join the room
    Socket.on('FreeToJoin', ({ status }) => {

      if (status) {
        setisFreeToJoin( true )
        return
      }

      setisFreeToJoin( false )

    })

    //this event triggerd when the room admin ban you from the room
    Socket.on('GoOut', () => {
      showTost("the admin drop you from this room");
      setTimeout(function () {
        document.location.href = "/"
      }, 200);
    })

    //this event triggred when you becam admin and the room setting seted 
    Socket.on('switchAdminSetting', ({ isRoomLocked, isStream, IsPublic }) => {
      setLock(isRoomLocked)
      setisStream(isStream)
      setHiddeTheRoom( IsPublic )

    })

    //this event triggred when admin switch to another youser
    Socket.on('switchAdmin', ({ admin }) => {
      setBossId( admin )

      // if you are the new admin set you as admin
      if (admin === Socket.id) {

        setFirst( true )

      }
      /* 
      find the new admin in the room and set
      his view to the big view and clear his 
      postion in the guest list
      */
      let UsersGuest = [...guest]
      let posthion;
      UsersGuest.forEach(User => {
        if (User[1] === BossId) {
          UsersGuest[0][0].current.srcObject = User[0].current.srcObject
          UsersGuest[0][1] = BossId
          posthion = UsersGuest.indexOf(User)
          User[1] = 0
        }

      })

      setGuest(UsersGuest )
      CloseTheSideCaller(posthion);


    })

    //this event triggerd when you recive a privet message
    //it will save to HistoryChat
    Socket.on('PrivetMessage', function (Message) {
      let HistoryChat = [...HistoryChat]

      HistoryChat.push(<div className="alr messageitem ">{Message}</div>)

      setHistoryChat( HistoryChat );
    });

    //this event triggerd when you recive a  message
    //it will save to HistoryChat
    Socket.on('Message', function (Message) {

      let HistoryChat = [...HistoryChat]

      HistoryChat.push(<div className="alr messageitem ">{Message.Message}</div>)

      setHistoryChat( HistoryChat );
    });
  }

  //this function take small imge from the user video
  // and send it to the server as a thumnail imge
 const TakeThumbnailImage = () =>{
    var context = CanvasImg.current.getContext('2d');

    context.drawImage(guest[0][0].current, 0, 0, 280, 200);

    var data = CanvasImg.current.toDataURL('image/png', 0.1);
    console.log('IMGE EMITED TO SERVER ')

    Socket.emit('saveimg', data,
      (data) => {
        console.log('IMGE EMITED TO SERVER ')
       }
    )

  }


  const componentWillUnmount =() =>{

   

    try {
      //close all the consumer transport
      console.log(consumerTransports.length)
      if(!consumerTransports.length) return

      consumerTransports.forEach(Transports => {
        if(Transports===null) return

        Transports.consumerTransport.close()
        Transports.consumer.close()
      });

    } catch (e) {
      console.log(e)

    }

    try {
      //close the send  producer transport
      console.log(producerTransport)
      if(producerTransport===null) return
      producerTransport.close()
    } catch (e) {
      console.log(e)

    }



    console.log('Leving this component');
    try {
      //when leave the page close the cam 
      let newgist = [...guest]

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




  }

  //this function will connecect the socketio server 
  // and save some initail date to the state
  // this function shuld run after the component have mounted
 const startConncting = () => {
 //   await setState({ socket: io('http://localhost:6800') });

    //set all css view cases the false excpit the frist one
    connectToServer()
    let CaseEditer = [...Case]
    Case.forEach((c, i) => {
      CaseEditer[i] = false
      if (i === 0) CaseEditer[i] = true;
    })

 setCase( CaseEditer )

    let GuestEditer = [...guest]
    guest.forEach((g, i) => {
      GuestEditer[i][0] = React.createRef();
      GuestEditer[i][1] = 0;
      GuestEditer[i][2] = true;
    })
    
    setGuest( GuestEditer );


    try {
      //if the isviewer came as true dont run the cam 
      //star connection to the server to watch the stream
      console.log(navigate)
      if (navigate.state.IsViewer) {
        CreateOrJoinTheRoom()

      } else {
        //run the cam and the the  StartUserCamra function will connect to the server
        StartUserCamra(0);
      }
    }

    catch (e) {
      console.log(e)
      StartUserCamra(0);

    }



  }


  useEffect(()=>{

        //when the component is mounted start connecting to the server
        console.log('START CALL BORAD USEEFFECT')
        if(SocketId){
          startConncting();

        }


        return ()=>componentWillUnmount()
  },[SocketId])

  //this check if the id if 0 it visible 
 const IsVedioElemntVisble=(id) =>{
    if (id === 0) return false

    return true

  }

  //this function will start accessing the webcam
  //and make it avalbe if the user is viewer will not connect to
  // to the server if not will connect to the server and 
 const StartUserCamra=(i)=> {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: {
          min: 640,
          max: 1920,
        },
        height: {
          min: 400,
          max: 1080,
        }
      }
    })
      .then(function (stream) {
        let track = stream.getVideoTracks()[0]
       // let params = params
       let Params = {
          track,
          ...params
        }
        setParam(Params)
        

        var guestList = [...guest]
        if (Socket.id) {
          console.log(Socket.id)

          guestList[i][1] = Socket.id
        }
        guestList[i][0].current.srcObject = stream;

        setGuest( guestList );
        if (i === 0) {
          CreateOrJoinTheRoom();
        }
        //whait a bit to let the cam load and then
        //take a ThumbnailImage if the user is admin
        setTimeout(() => {
          console.log(First)
          if (First) {

            TakeThumbnailImage();
          }
        }, 500);

      })

      .catch(function (err) {

        console.log("An error occurred: " + err);
      });

  }

  //this function will lock the room
  // the server will check if you are the admin
 const LockRoom = (e) =>{
    setLock(e.target.checked);
    Socket.emit('LockTheRoom', Lock, data => { })
  }

  //this function will prevent the roomfrom streaming to the public
  // the server will check if you are the admin
  const isStream=(e) =>{
    setisStream( e.target.checked )
    Socket.emit('isStream', isStream, data => { })
  }


  //this function will hide the room
  // the server will check if you are the admin
 const doHiddeTheRoom = (e) =>{
    setHiddeTheRoom( e.target.checked )
    Socket.emit('HiddeTheRoom', Lock, data => { })
  }

  //this function will ban a spesifc user apssed 
  // to it the server will check if you are the admin
 const KikHimOut = (socketid) => {
    let guest = guest.find((geust, i) => geust[1] === socketid)
    ToogleBox(guest)
    Socket.emit('kik', socketid, data => { })
  }

  //this function wil just go
  // to the same page to allow the user
  // to join this room
  const JoinTheRoom =()=> {
    navigate({
      pathname: '/Switch',
      state: {IsPublic:false, IsViewer: false, CallBorad: true, TheRoom: Room }
    })
  }
  /*
  this function will add the stream of users 
  and display it and if the user comming is admin
  it will put it in the main view
  */
const  AddMediaStream = (userid, stream)=> {

    let guestlist = [...guest]

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
            ShowTheSideCaller(i)
            break;
          }
        }
        break;
      }

      if (guestlist[i][1] === 0) {
        guestlist[i][0].current.srcObject = stream;
        guestlist[i][1] = userid;
        ShowTheSideCaller(i)
        break;
      }
    }

    setGuest( guestlist )

  }

  //this function will will show the messages from the state
 const ShowHistoryChat = () =>{
    return HistoryChat.forEach(m => <div> {m}</div>)
  }

  //this function will close the side bar when no active view in it
 const CloseTheSideCaller = (i) =>{

    if ((i === 1 || i === 2) && guest[1][1] === 0 && guest[2][1] === 0) {

      ToggleElementCssClass(1)

    }

    if ((i === 3 || i === 4) && guest[3][1] === 0 && guest[4][1] === 0) {
      ToggleElementCssClass(2)
    }


  }

  // this function will get the css class from view depnd on the current case
 const GetElemntCssClass = (Postion) =>{

    return view[Postion][Case.indexOf(true)]
  }

  //this function will open the side bar when there is active view in it
 const ShowTheSideCaller = (i) =>{
    if (i !== 0) {
      let iscase = Case.indexOf(true);
      if ((i === 1 || i === 2) && ![2, 3, 4, 5].includes(iscase)) {
        ToggleElementCssClass(1)
      }

      if ((i === 3 || i === 4) && ![3, 4, 6, 7].includes(iscase)) {
        ToggleElementCssClass(2)

      }
    }
  }

  //this fuction will check the css cass and
  //toggle it to its oppessit case in the cases arry
  const ToggleElementCssClass=(i)=> {
    let stv = Case.indexOf(true)

    let nev = ChangeStatVale[i][stv]

    let cc = [...Case]

    cc[stv] = false
    cc[nev] = true
    setCase( cc );
  }

  //this function will create a device for mediasoup api
 const createDevice = async () => {
    try {
      let device = new Device()

      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
      // Loads the device with RTP capabilities of the Router (server side)
      // let routerRtpCapabilities = rtpCapabilities

      await device.load({ routerRtpCapabilities: rtpCapabilities });

      setDevice(device )
      device = null;

      //if the user is not viewr create send transport
      if (!IsViewer) {
        // once the device loads, create transport
        createSendTransport()

      } else {

        //get the current producers and chek if joining the room is avaliple
        getProducers()

        Socket.emit('isFreeToJoin', { roomName: Room }, (data) => {
          if (data.status) {
            setisFreeToJoin( true )
          } else {
            setisFreeToJoin( false )

          }

        })
      }

    } catch (error) {

      if (error.name === 'UnsupportedError')
        console.warn('browser not supported')
    }
  }

  /*
  this function used when new user joied the room and it take
  the remotpruducer and socketid create a recive transport
  and tell the server to create a consumer transport 
  */
  const signalNewConsumerTransport = async (remoteProducerId, socketId) => {

    await Socket.emit('createWebRtcTransport', { consumer: true }, ({ params }) => {
      // The server sends back params needed 
      // to create Send Transport on the client side
      if (params.error) {
        console.log(params.error)
        return
      }
      console.log(`PARAMS... ${params}`)

      let consumerTransport
      try {
        consumerTransport = device.createRecvTransport(params)
      } catch (error) {
        // exceptions: 
        // {InvalidStateError} if not loaded
        // {TypeError} if wrong arguments.
        console.log(error)
        return
      }

      consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          // Signal local DTLS parameters to the server side transport
          // see server's Socket.on('transport-recv-connect', ...)
          await Socket.emit('transport-recv-connect', {
            dtlsParameters,
            serverConsumerTransportId: params.id,
          })

          // Tell the transport that parameters were transmitted.
          callback()
        } catch (error) {
          // Tell the transport that something was wrong
          errback(error)
        }
      })
      // after createing the tranpsort connect to it
      connectRecvTransport(consumerTransport, remoteProducerId, socketId, params.id)
    })
    //if viewr check if room is avalipee to join
    if (IsViewer) {
      Socket.emit('isFreeToJoin', { roomName: Room }, (data) => {
        if (data.status) {
          setisFreeToJoin( true )
        } else {
          setisFreeToJoin( false )

        }

      })
    }
  }

  //this function will create transport to send your strean
  const createSendTransport = () => {
    // see server's Socket.on('createWebRtcTransport', sender?, ...)
    // this is a call from Producer, so sender = true
    Socket.emit('createWebRtcTransport', { consumer: false }, ({ params }) => {
      // The server sends back params needed 
      // to create Send Transport on the client side
      if (params.error) {
        console.log(params.error)
        return
      }

      console.log(params)

      // creates a new WebRTC Transport to send media
      // based on the server's producer transport params
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
      setproducerTransport(device.createSendTransport(params))

      // https://mediasoup.org/documentation/v3/communication-between-client-and-server/#producing-media
      // this event is raised when a first call to transport.produce() is made
      // see connectSendTransport() below
      producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          // Signal local DTLS parameters to the server side transport
          // see server's Socket.on('transport-connect', ...)
          await Socket.emit('transport-connect', {
            dtlsParameters,
          })

          // Tell the transport that parameters were transmitted.
          callback()

        } catch (error) {
          errback(error)
        }
      })

      producerTransport.on('produce', async (parameters, callback, errback) => {
        console.log(parameters)

        try {
          // tell the server to create a Producer
          // with the following parameters and produce
          // and expect back a server side producer id
          // see server's Socket.on('transport-produce', ...)
          await Socket.emit('transport-produce', {
            kind: parameters.kind,
            rtpParameters: parameters.rtpParameters,
            appData: parameters.appData,
          }, ({ id, producersExist }) => {
            // Tell the transport that parameters were transmitted and provide it with the
            // server side producer's id.
            callback({ id })

            // if producers exist, then join room
            if (producersExist) getProducers()
          })
        } catch (error) {
          errback(error)
        }
      })

      connectSendTransport()
    })
  }

  //this function will get all 
  // current producer from the server and counsume them
  const getProducers = () => {
    Socket.emit('getProducers', {
      isViewr: IsViewer,
      roomName: Room
    }, producerIds => {
      console.log(producerIds)
      // for each of the producer create a consumer
      // producerIds.forEach(id => signalNewConsumerTransport(id))
      producerIds.forEach(producer => signalNewConsumerTransport(producer[0], producer[1]))
    })
  }

  //connect the rescv transport
  const connectRecvTransport = async (consumerTransport, remoteProducerId, socketId, serverConsumerTransportId) => {
    // for consumer, we need to tell the server first
    // to create a consumer based on the rtpCapabilities and consume
    // if the router can consume, it will send back a set of params as below
    await Socket.emit('consume', {
      rtpCapabilities: device.rtpCapabilities,
      remoteProducerId,
      serverConsumerTransportId,
    }, async ({ params }) => {
      if (params.error) {
        console.log('Cannot Consume')
        return
      }

      console.log(`Consumer Params ${params}`)
      console.log(params)
      // then consume with the local consumer transport
      // which creates a consumer
      const consumer = await consumerTransport.consume({
        id: params.id,
        producerId: params.producerId,
        kind: params.kind,
        rtpParameters: params.rtpParameters
      })

      let consumerTransports = [
        ...consumerTransports,
        {
          consumerTransport,
          serverConsumerTransportId: params.id,
          producerId: remoteProducerId,
          consumer,
        },
      ]

      setConsumerTransports(consumerTransports)

      const { track } = consumer

      //add the new stream to the view 
      AddMediaStream(socketId, new MediaStream([track]))

      // the server consumer started with media paused
      // so we need to inform the server to resume
      Socket.emit('consumer-resume', { serverConsumerId: params.serverConsumerId })
    })
  }

  //this function will connect our send transport to the server
  const connectSendTransport = async () => {
    // we now call produce() to instruct the producer transport
    // to send media to the Router
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
    // this action will trigger the 'connect' and 'produce' events above
    console.log(params)
    let producer = await producerTransport.produce(params)

    setProducer(producer)
    producer.on('trackended', () => {
      console.log('track ended')

      // close video track
    })

    producer.on('transportclose', () => {
      console.log('transport ended')

      // close video track
    })
  }

  //this function called when user quit the room
  // it will clear his postion it the guist list
  // and close the side bar
 const completeSession = (id) => {
    //remove the socket from thw queu list
    //if(queueGuest[id]) setState({queueGuest:[...queueGuest.filter(guest=>guest!==id)]})

    var guestList = [...guest];

    let thegustid;

    guestList.forEach((geist, i) => {
      if (geist[1] === id) {
        console.log(i)
        geist[1] = 0;
        thegustid = i;

      }

    })

    setGuest(guestList)
    CloseTheSideCaller(thegustid);


  };




    return (
      <>

        <ToastContainer />

        <canvas ref={CanvasImg} className='d-none' width='280' height='200' id="canvas"></canvas>

        <div className="container-fluid	">

          <div className="row ">
            <br></br>
            <br></br>

          </div>
          <br></br>

          <div style={!IsViewer ? { display: 'none' } : { display: 'block' }} className="custom-control custom-switch">
            <div style={!isFreeToJoin ? { display: 'none' } : { display: 'block' }} className="custom-control custom-switch">
              <span
                onClick={JoinTheRoom} className="badge badge-primary btn ">
                Free window To Join

              </span>
            </div>
          </div>

            <div  style={!First ? { display: 'none' } : { display: 'block' }} className="custom-control custom-switch">
              <input
                onChange={(e)=>LockRoom(e)}
                type="checkbox"
                checked={Lock}
                className=" custom-control-input"
                name="Lock"

                id="customSwitch2">
              </input>
              <label className="custom-control-label" htmlFor="customSwitch2">Lock the rooms</label>
            </div>


            <div  style={!First ? { display: 'none' } : { display: 'block' }} className="custom-control custom-switch">
              <input
                onChange={(e)=>doHiddeTheRoom(e)}
                type="checkbox"
                checked={HiddeTheRoom}
                className="d- custom-control-input"
                name="HiddeTheRoom"

                id="customSwitch3">
              </input>
              <label className="custom-control-label" htmlFor="customSwitch4">the rooms is not hidden</label>
            </div>

            <div  style={!First ? { display: 'none' } : { display: 'block' }} className="custom-control custom-switch">
              <input
                onChange={(e)=>isStream(e)}
                type="checkbox"
                checked={IsStream}
                className="  custom-control-input"
                name="HiddeTheRoom"

                id="customSwitch4">
              </input>
              <label className="custom-control-label" htmlFor="customSwitch4">Stop public Streaming</label>
            </div>


          <div className="  row no-gutters   justify-content-md-center h-100 ">


            <div className={GetElemntCssClass(0) + ` chatback`}>
              <form className="form-inline h-80 justify-content-md-center ">
                <div className="h-100 w-80 overflow-auto">
                  <div className='mhchat'>
                    {HistoryChat}

                  </div>
                </div>
                <input
                  onChange={(e)=>setChatMessage(e.target.value)}

                  type="text" className="w-80 form-control"
                  value={ChatMessage}
                  name="ChatMessage" placeholder="Chat here">

                </input>

                <button type="submit"
                  onClick={SendMessageChat} className=" btn sendc">
                </button>
                <div className="input-group-prepend"></div>
              </form>
            </div>

            <div className={GetElemntCssClass(1)}>

              <div
                className={`${IsVedioElemntVisble(guest[1][1]) ? 'visible' : 'd-none'}  `}>
                <video
                  ref={guest[1][0]}
                  className="Vd-box h-0 w-100" autoPlay >
                </video>
                <span onClick={() => ToogleBox(guest[1])} className=" video-controls btn"></span>

              </div>

              <div
                className={`${IsVedioElemntVisble(guest[2][1]) ? 'visible' : 'd-none'}  `}>
                <video ref={guest[2][0]} className="Vd-box h-0 w-100" autoPlay>
                </video>

                <span onClick={() => ToogleBox(guest[2])} className="  video-controls btn"></span>

              </div>

            </div>


            <div className={GetElemntCssClass(2) + ` `}>


              <video
                ref={guest[0][0]} autoPlay
                className="Vd-box h-0 w-100 ">
              </video>
              <span
                onClick={() => ToogleBox(guest[0])}
                className={`${!First ? 'visible' : 'd-none'}  video-controls btn `}
              ></span>

            </div>

            <div className={GetElemntCssClass(3)}>



              <div
                className={`${IsVedioElemntVisble(guest[3][1]) ? 'visible' : 'd-none'}  `}>
                <video ref={guest[3][0]} className="Vd-box h-0 w-100" autoPlay>
                </video>

                <span onClick={() => ToogleBox(guest[3])} className="  video-controls btn"></span>

              </div>


              <div
                className={`${IsVedioElemntVisble(guest[4][1]) ? 'visible' : 'd-none'}  `}>
                <video ref={guest[4][0]} className="Vd-box h-0 w-100" autoPlay>
                </video>

                <span onClick={() => ToogleBox(guest[4])} className="  video-controls btn"></span>

              </div>


            </div>
            <div className="SideBarChat">


              <button type="submit" onClick={() => ToggleElementCssClass(0)}
                className={`${GetElemntCssClass(0) === 'd-none' ? 'OpenChat' : 'CloseChat'} btn`}></button>
            </div>
          </div>
        </div>
        <Footer></Footer>
        <Modal admin={First}
          Id={guest[0]}
          KikHimOut={KikHimOut}
          ToogleBox={ToogleBox}
          PrivetMessage={PrivetMessage}
          SendPrivetMessage={SendPrivetMessage}
          setPrivetMessage={setPrivetMessage}
          ></Modal>

        <Modal admin={First}
          Id={guest[1]}
          KikHimOut={KikHimOut}
          ToogleBox={ToogleBox}
          PrivetMessage={PrivetMessage}
          SendPrivetMessage={SendPrivetMessage}
          setPrivetMessage={setPrivetMessage}
      ></Modal>

        <Modal 
          admin={First}
          Id={guest[2]}
          KikHimOut={KikHimOut}
          ToogleBox={ToogleBox}
          PrivetMessage={PrivetMessage}
          SendPrivetMessage={SendPrivetMessage}
          setPrivetMessage={setPrivetMessage}
          ></Modal>


        <Modal admin={First}
          Id={guest[3]}
          KikHimOut={KikHimOut}
          ToogleBox={ToogleBox}
          PrivetMessage={PrivetMessage}
          SendPrivetMessage={SendPrivetMessage}
          setPrivetMessage={setPrivetMessage}
          ></Modal>


        <Modal admin={First}
          Id={guest[4]}
          KikHimOut={KikHimOut}
          ToogleBox={ToogleBox}
          PrivetMessage={PrivetMessage}
          SendPrivetMessage={SendPrivetMessage}
          setPrivetMessage={setPrivetMessage}
          ></Modal>

      </>
    );
  

    }


const   params  ={   // mediasoup configratio params 

  encodings: [
    {
      rid: 'r0',
      maxBitrate: 100000,
      scalabilityMode: 'S1T3',
    },
    {
      rid: 'r1',
      maxBitrate: 300000,
      scalabilityMode: 'S1T3',
    },
    {
      rid: 'r2',
      maxBitrate: 900000,
      scalabilityMode: 'S1T3',
    },
  ],
  // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
  codecOptions: {
    videoGoogleStartBitrate: 1000
  }
}

const initialState = {
  socket: null,                 //the socket io ini will be stored here
  rtpCapabilities: '',          //the rtp infor retrived from the server will be stored here
  isFreeToJoin: false,          //the if ther room is avalble to join
  HiddeTheRoom: true,           //if the room is hidden from punlic
  Lock: false,                  //is the room is lock
  device: null,                 //mediasoup driver will be stoed here
  IsViewer: false,              //if the user is viewer or memper of ther room
  isStream:false,               //if the room is stream publicly or not
  producerTransport: null,      //the proucert transport will be stored here
  consumerTransports: [],       //the memper of the room will be stored herer
  producer: null,               //if the user procues stream will be stored here
  BossId: 0,                    //the admin of ther room id will be stord here
  HistoryChat: [],              //the chat log will be stored here
  guest: [[], [], [], [], []],  //this list will contain the room users
  case: [true, false, false,    //the curren case of the view
    false, false, false],
  ChatMessage: "",              //the value of the chat box
  PrivetMessage: "",            //the value of the privet message chat box
  First: false,                 //the state of the user if admin or not
 // queueGuest:[],              //the queu is a list of new users t prevent dublicate
  ChangeStatVale: [             //the vlue of the css case classes
    [1, 0, 5, 4, 3, 2, 7, 6],
    [5, 2, 1, 7, 6, 0, 4, 3],
    [6, 7, 3, 2, 5, 4, 0, 1]]
  ,
  view:                         //the array of class in each cases
    [
      ['d-none', 'col-md-6', 'col-md-4', 'col-md-4', 'd-none', 'd-none', 'd-none', 'col-md-4'],
      ['d-none', 'd-none', 'col-md-3', 'col-md-2', 'col-md-3', 'col-md-4', 'd-none,d-none'],
      ['col-md-7', 'col-md-6', 'col-md-5', 'col-md-4', 'col-md-6', 'col-md-6', 'col-md-6', 'col-md-5'],
      ['d-none', 'd-none', 'd-none', 'col-md-2', 'col-md-3', 'd-none', 'col-md-4', 'col-md-3']]
  


}
export default CallBord;


/*

   
         [boolead]       [view1  ,     view1     ,  view1  ,   view1  ,]
      view               [    view1        view2       view3       view4]
  case [0] [boolead][view]     x     ||     x     || col-md-6 ||    x  
  case [1] [boolead][view]   col-md-6||     x     || col-md-6 ||    x
  case [2] [boolead][view]   col-md-4||  col-md-3 || col-md-5 ||    x
  case [3] [boolead][view]   col-md-4||  col-md-2 || col-md-4 || col-md-2
  case [4] [boolead][view]      x    ||  col-md-3 || col-md-6 || col-md-3
  case [5] [boolead][view]      x    ||  col-md-4 || col-md-6 ||    x
  case [6] [boolead][view]      x    ||     x     || col-md-6 || col-md-4
  case [7] [boolead][view]  col-md-4 ||     x     || col-md-5 || col-md-3


  closeCaller(){

  view --2
    ---3 set 2
    ---4 set 5
    ---6 set 0
    ---7 set 1
    ---0 set 6
    ---1 set 7
    ---2 set 3
    ---5 set 4

  }

  shoeCaller(){
  view --1
    ---0 set 5
    ---1 set 2
    ---6 set 4
    ---7 set 3
    ---2 set 1
    ---3 set 7
    ---4 set 6
    ---5 set 0
    }
  ToogleChat(){
    ---0 set 1 
    ---1 set 0
    ---2 set 5 
    ---5 set 2
    ---3 set 4
    ---4 set 3
    ---6 set 7
    ---7 set 6
  }

*/