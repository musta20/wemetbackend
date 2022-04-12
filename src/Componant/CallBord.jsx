
import React, { Component } from 'react';
import Modal from './Modal';
import io from "socket.io-client";
import { Device } from 'mediasoup-client';
import { withRouter } from 'react-router'
import Footer from './Footer';



import { ToastContainer, toast } from 'react-toastify';
class CallBord extends Component {
  constructor(props) {
    super(props)

    this.state = initialState;
    this.canvas = React.createRef();
    this.photo = React.createRef();
    this.showTost = this.showTost.bind(this);
    this.CreateOrJoinTheRoom = this.CreateOrJoinTheRoom.bind(this)
    this.createSendTransport = this.createSendTransport.bind(this)
    this.createDevice = this.createDevice.bind(this);
    this.StartUserCamra = this.StartUserCamra.bind(this);
    this.IsVedioElemntVisble = this.IsVedioElemntVisble.bind(this);
    this.CloseTheSideCaller = this.CloseTheSideCaller.bind(this)
    this.AddMediaStream = this.AddMediaStream.bind(this);
    this.GetElemntCssClass = this.GetElemntCssClass.bind(this);
    this.ToggleElementCssClass = this.ToggleElementCssClass.bind(this);
    this.ShowTheSideCaller = this.ShowTheSideCaller.bind(this);
    this.ShowHistoryChat = this.ShowHistoryChat.bind(this);
    this.SendMessageChat = this.SendMessageChat.bind(this);
    this.onChange = this.onChange.bind(this)
    this.TakeThumbnailImage = this.TakeThumbnailImage.bind(this)
    this.signalNewConsumerTransport = this.signalNewConsumerTransport.bind(this)
    this.connectRecvTransport = this.connectRecvTransport.bind(this)
    this.completeSession = this.completeSession.bind(this)
    this.getProducers = this.getProducers.bind(this)
    this.isStream = this.isStream.bind(this)
    this.KikHimOut = this.KikHimOut.bind(this)
    this.SendPrivetMessage = this.SendPrivetMessage.bind(this)
    this.ToogleBox = this.ToogleBox.bind(this)
    this.LockRoom = this.LockRoom.bind(this)
    this.HiddeTheRoom = this.HiddeTheRoom.bind(this)
    this.JoinTheRoom = this.JoinTheRoom.bind(this)
    this.startConncting = this.startConncting.bind(this)


  }

  //this function will show the notftion
  showTost(data) {
    toast(data)
  }

  //open or close the dilog for a selected user
  //identfi the user that clicked on and safe the state
  //of the box 
  ToogleBox(guest) {
    let Guests = [...this.state.guest]
    let index = this.state.guest.indexOf(guest)

    if (guest[2]) {
      Guests[index][2] = false
      this.setState({ guest: Guests })

    } else {
      Guests[index][2] = true
      this.setState({ guest: Guests })
    }

  }

  /*
  send a Privet message to user
  check if the input is empty and add it 
  to HistoryChat savet to the state empty the 
  chat box and send it to the server
  */
  SendPrivetMessage(e) {
    e.preventDefault();
    if (this.state.PrivetMessage.trim() === "") return

    let HistoryChat = [...this.state.HistoryChat]
    HistoryChat.push(<div className=" messageitem ">
      {this.state.PrivetMessage}</div>)
    this.setState({ HistoryChat });
    this.setState({ PrivetMessage: "" })
    this.state.socket.emit('SendPrivetMessage',
      { id: e.target.id, Message: this.state.PrivetMessage }, room => {
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
  SendMessageChat(e) {
    e.preventDefault();
    if (this.state.ChatMessage.trim() === "") return

    let HistoryChat = [...this.state.HistoryChat]
    HistoryChat.push(<div className=" messageitem ">
      {this.state.ChatMessage}</div>)
    this.setState({ HistoryChat });
    this.setState({ ChatMessage: "" })
    this.state.socket.emit('Message',
      '{"title":"' + this.props.match.params.room + '"}',
      this.state.ChatMessage,
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

  CreateOrJoinTheRoom() {
    let IsViewer;
    let IsPublic = null;

    try {
      if (this.props.location.state.IsViewer) {
        IsViewer = true

      } else {
        IsViewer = false
      }
    } catch (e) {
      IsViewer = false

    }

    try {
      if (!this.props.location.state.IsPublic) {
        IsPublic = false;

      } else {
        IsPublic = true;

      }
    }
    catch (e) {
      IsPublic = true;

    }

    //create room name it this way to add mor info in in the room name    
    let FullRoomName = '{"title":"' + this.props.match.params.room +
      '","IsPublic":' + IsPublic +
      ',"IsViewer":' + IsViewer + '}';

    this.state.socket.emit('CreateStream', FullRoomName
      ,
      ({ status, rtpCapabilities, BossId, room, First }) => {


        if (!status) {
          //if status came with wrong result and rtpCapabilities
          // that mean you just gone watch  the room
          if (rtpCapabilities) {

            this.showTost(room);
            this.setState({ BossId })

            this.setState({ rtpCapabilities })
            this.setState({ IsViewer: true })

            // once we have rtpCapabilities from the Router, create Device
            this.createDevice()

            return
          }
          // if error happen quit the app and got to home page
          setTimeout(function () {
            this.showTost("The room is not strmed");
            document.location.href = "/"
          }, 2000);
          return
        }

        //if this value came as true you are the admin of this room
        if (First) {
          this.setState({ First: true })
          this.setState({ BossId: this.state.socket.id })
          this.setState({ HiddeTheRoom: IsPublic })
        } else {
          this.setState({ BossId })
        }

        this.showTost(room);
        this.setState({ rtpCapabilities })
        this.createDevice()
      })

    //this event new-prouducer triggerd a new user is joined the room and 
    // you gone resive his stream via producerId and socketId is his socket id
    this.state.socket.on('new-producer', async ({ producerId, socketId }) => {
     //console.log(this.state.queueGuest)
     //if(this.state.queueGuest[socketId]) return
     //this.setState({queueGuest:[...this.state.queueGuest,socketId]})
      await this.signalNewConsumerTransport(producerId, socketId)

    })
    //this event triggred when user colse his stram you shuld close 
    //the connection to prevent memory leak
    this.state.socket.on('producer-closed', ({ remoteProducerId, socketId }) => {
      //find the specifc transport and close it
      try {
        const producerToClose = this.state.consumerTransports.find(transportData => transportData.producerId === remoteProducerId)
        producerToClose.consumerTransport.close()
        producerToClose.consumer.close()
      } catch (e) {
        console.error(e)
      }
      // remove the consumer transport from the list
      let consumerTransports = [...this.state.consumerTransports.filter(transportData => transportData.producerId !== remoteProducerId)]
      this.setState({ consumerTransports })
      // hide the video div element
      this.completeSession(socketId)

    })

    //this event triggerd to notify you there is chance to join the room
    this.state.socket.on('FreeToJoin', ({ status }) => {

      if (status) {
        this.setState({ isFreeToJoin: true })
        return
      }

      this.setState({ isFreeToJoin: false })

    })

    //this event triggerd when the room admin ban you from the room
    this.state.socket.on('GoOut', () => {
      this.showTost("the admin drop you from this room");
      setTimeout(function () {
        document.location.href = "/"
      }, 200);
    })

    //this event triggred when you becam admin and the room setting seted 
    this.state.socket.on('switchAdminSetting', ({ isRoomLocked, isStream, IsPublic }) => {
      this.setState({ isRoomLocked, isStream, IsPublic })
      this.setState({ HiddeTheRoom: IsPublic })

    })

    //this event triggred when admin switch to another youser
    this.state.socket.on('switchAdmin', ({ admin }) => {
      this.setState({ BossId: admin })

      // if you are the new admin set you as admin
      if (admin === this.state.socket.id) {

        this.setState({ First: true })

      }
      /* 
      find the new admin in the room and set
      his view to the big view and clear his 
      postion in the guest list
      */
      let UsersGuest = [...this.state.guest]
      let posthion;
      UsersGuest.forEach(User => {
        if (User[1] === this.state.BossId) {
          UsersGuest[0][0].current.srcObject = User[0].current.srcObject
          UsersGuest[0][1] = this.state.BossId
          posthion = UsersGuest.indexOf(User)
          User[1] = 0
        }

      })

      this.setState({ guest: UsersGuest })
      this.CloseTheSideCaller(posthion);


    })

    //this event triggerd when you recive a privet message
    //it will save to HistoryChat
    this.state.socket.on('PrivetMessage', function (Message) {
      let HistoryChat = [...this.state.HistoryChat]

      HistoryChat.push(<div className="alr messageitem ">{Message}</div>)

      this.setState({ HistoryChat });
    }.bind(this));

    //this event triggerd when you recive a  message
    //it will save to HistoryChat
    this.state.socket.on('Message', function (Message) {

      let HistoryChat = [...this.state.HistoryChat]

      HistoryChat.push(<div className="alr messageitem ">{Message.Message}</div>)

      this.setState({ HistoryChat });
    }.bind(this));
  }

  //this function take the value and the name
  //from the input and save it to the state
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  //this function take small imge from the user video
  // and send it to the server as a thumnail imge
  TakeThumbnailImage() {
    var context = this.canvas.current.getContext('2d');

    context.drawImage(this.state.guest[0][0].current, 0, 0, 280, 200);

    var data = this.canvas.current.toDataURL('image/png', 0.1);

    this.state.socket.emit('saveimg', data,
      (data) => { }
    )

  }


  componentWillUnmount() {

    try {
      // disconnect from the socket server
      this.state.socket.disconnect()

    } catch (e) {
      console.log(e)

    }

    try {
      //close all the consumer transport
      console.log(this.state.consumerTransports.length)
      if(!this.state.consumerTransports.length) return

      this.state.consumerTransports.forEach(Transports => {
        if(Transports===null) return

        Transports.consumerTransport.close()
        Transports.consumer.close()
      });

    } catch (e) {
      console.log(e)

    }

    try {
      //close the send  producer transport
      console.log(this.state.producerTransport)
      if(this.state.producerTransport===null) return
      this.state.producerTransport.close()
    } catch (e) {
      console.log(e)

    }



    console.log('Leving this component');
    try {
      //when leave the page close the cam 
      let newgist = [...this.state.guest]

      newgist.forEach(guest => {

        if (guest[1] !== 0) {
          
          guest[0].current.srcObject.getVideoTracks().forEach(track => {
            console.log(track)

            track.stop()
          })
        }

      })

      this.setState({ guest: newgist })

    } catch (e) {

      console.log(e)

    }




  }

  //this function will connecect the socketio server 
  // and save some initail date to the state
  // this function shuld run after the component have mounted
  startConncting = async () => {
    await this.setState({ socket: io('http://localhost:6800') });

    //set all css view cases the false excpit the frist one
    let CaseEditer = [...this.state.case]
    this.state.case.forEach((c, i) => {
      CaseEditer[i] = false
      if (i === 0) CaseEditer[i] = true;
    })

    this.setState({ case: CaseEditer })

    let GuestEditer = [...this.state.guest]
    this.state.guest.forEach((g, i) => {
      GuestEditer[i][0] = React.createRef();
      GuestEditer[i][1] = 0;
      GuestEditer[i][2] = true;
    })
    this.setState({ guest: GuestEditer });


    try {
      //if the isviewer came as true dont run the cam 
      //star connection to the server to watch the stream
      if (this.props.location.state.IsViewer) {
        this.CreateOrJoinTheRoom()

      } else {
        //run the cam and the the  StartUserCamra function will connect to the server
        this.StartUserCamra(0);
      }
    }

    catch (e) {
      console.log(e)
      this.StartUserCamra(0);

    }



  }

  componentDidMount() {
    //when the component is mounted start connecting to the server
    this.startConncting();
  }

  //this check if the id if 0 it visible 
  IsVedioElemntVisble(id) {
    if (id === 0) return false

    return true

  }

  //this function will start accessing the webcam
  //and make it avalbe if the user is viewer will not connect to
  // to the server if not will connect to the server and 
  StartUserCamra(i) {
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
        let params = this.state.params
        params = {
          track,
          ...params
        }
        this.setState({ params })

        var guestList = [...this.state.guest]
        if (this.state.socket.id) {
          guestList[i][1] = this.state.socket.id
        }
        guestList[i][0].current.srcObject = stream;

        this.setState({ guest: guestList });
        if (i === 0) {
          this.CreateOrJoinTheRoom();
        }
        //whait a bit to let the cam load and then
        //take a ThumbnailImage if the user is admin
        setTimeout(() => {

          if (this.state.First) {

            this.TakeThumbnailImage();
          }
        }, 500);

      }.bind(this))

      .catch(function (err) {

        console.log("An error occurred: " + err);
      });

  }

  //this function will lock the room
  // the server will check if you are the admin
  LockRoom(e) {
    this.setState({ Lock: e.target.checked })
    this.state.socket.emit('LockTheRoom', this.state.Lock, data => { })
  }

  //this function will prevent the roomfrom streaming to the public
  // the server will check if you are the admin
  isStream(e) {
    this.setState({ isStream: e.target.checked })
    this.state.socket.emit('isStream', this.state.isStream, data => { })
  }


  //this function will hide the room
  // the server will check if you are the admin
  HiddeTheRoom(e) {
    this.setState({ HiddeTheRoom: e.target.checked })
    this.state.socket.emit('HiddeTheRoom', this.state.Lock, data => { })
  }

  //this function will ban a spesifc user apssed 
  // to it the server will check if you are the admin
  KikHimOut(socketid) {
    let guest = this.state.guest.find((geust, i) => geust[1] === socketid)
    this.ToogleBox(guest)
    this.state.socket.emit('kik', socketid, data => { })
  }

  //this function wil just go
  // to the same page to allow the user
  // to join this room
  JoinTheRoom() {
    this.props.history.push({
      pathname: '/Switch',
      state: {IsPublic:false, IsViewer: false, CallBorad: true, TheRoom: this.props.match.params.room }
    })
  }
  /*
  this function will add the stream of users 
  and display it and if the user comming is admin
  it will put it in the main view
  */
  AddMediaStream(userid, stream) {

    let guestlist = [...this.state.guest]

    for (let i = 1; i < guestlist.length; i++) {

      if (userid === this.state.BossId) {

        guestlist[0][0].current.srcObject = stream;
        guestlist[0][1] = userid;

        if (this.state.IsViewer) break;

        for (let i = 1; i < guestlist.length; i++) {
          if (guestlist[i][1] === 0) {

            guestlist[i][1] = this.state.socket.id;

            if (!this.state.IsViewer) {

              this.StartUserCamra(i);

            }
            this.ShowTheSideCaller(i)
            break;
          }
        }
        break;
      }

      if (guestlist[i][1] === 0) {
        guestlist[i][0].current.srcObject = stream;
        guestlist[i][1] = userid;
        this.ShowTheSideCaller(i)
        break;
      }
    }

    this.setState({ guest: guestlist })

  }

  //this function will will show the messages from the state
  ShowHistoryChat() {
    return this.state.HistoryChat.forEach(m => <div> {m}</div>)
  }

  //this function will close the side bar when no active view in it
  CloseTheSideCaller(i) {

    if ((i === 1 || i === 2) && this.state.guest[1][1] === 0 && this.state.guest[2][1] === 0) {

      this.ToggleElementCssClass(1)

    }

    if ((i === 3 || i === 4) && this.state.guest[3][1] === 0 && this.state.guest[4][1] === 0) {
      this.ToggleElementCssClass(2)
    }


  }

  // this function will get the css class from view depnd on the current case
  GetElemntCssClass(Postion) {

    return this.state.view[Postion][this.state.case.indexOf(true)]
  }

  //this function will open the side bar when there is active view in it
  ShowTheSideCaller(i) {
    if (i !== 0) {
      let iscase = this.state.case.indexOf(true);
      if ((i === 1 || i === 2) && ![2, 3, 4, 5].includes(iscase)) {
        this.ToggleElementCssClass(1)
      }

      if ((i === 3 || i === 4) && ![3, 4, 6, 7].includes(iscase)) {
        this.ToggleElementCssClass(2)

      }
    }
  }

  //this fuction will check the css cass and
  //toggle it to its oppessit case in the cases arry
  ToggleElementCssClass(i) {
    let stv = this.state.case.indexOf(true)

    let nev = this.state.ChangeStatVale[i][stv]

    let cc = [...this.state.case]

    cc[stv] = false
    cc[nev] = true
    this.setState({ case: cc });
  }

  //this function will create a device for mediasoup api
  createDevice = async () => {
    try {
      let device = new Device()

      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
      // Loads the device with RTP capabilities of the Router (server side)
      // let routerRtpCapabilities = this.state.rtpCapabilities

      await device.load({ routerRtpCapabilities: this.state.rtpCapabilities });
      console.log(device)
      this.setState({ device })
      device = null;

      //if the user is not viewr create send transport
      if (!this.state.IsViewer) {
        // once the device loads, create transport
        this.createSendTransport()

      } else {

        //get the current producers and chek if joining the room is avaliple
        this.getProducers()

        this.state.socket.emit('isFreeToJoin', { roomName: this.props.match.params.room }, (data) => {
          if (data.status) {
            this.setState({ isFreeToJoin: true })
          } else {
            this.setState({ isFreeToJoin: false })

          }

        })
      }

    } catch (error) {
      console.log(error)
      if (error.name === 'UnsupportedError')
        console.warn('browser not supported')
    }
  }

  /*
  this function used when new user joied the room and it take
  the remotpruducer and socketid create a recive transport
  and tell the server to create a consumer transport 
  */
  signalNewConsumerTransport = async (remoteProducerId, socketId) => {

    await this.state.socket.emit('createWebRtcTransport', { consumer: true }, ({ params }) => {
      // The server sends back params needed 
      // to create Send Transport on the client side
      if (params.error) {
        console.log(params.error)
        return
      }
      console.log(`PARAMS... ${params}`)

      let consumerTransport
      try {
        consumerTransport = this.state.device.createRecvTransport(params)
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
          // see server's socket.on('transport-recv-connect', ...)
          await this.state.socket.emit('transport-recv-connect', {
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
      this.connectRecvTransport(consumerTransport, remoteProducerId, socketId, params.id)
    })
    //if viewr check if room is avalipee to join
    if (this.state.IsViewer) {
      this.state.socket.emit('isFreeToJoin', { roomName: this.props.match.params.room }, (data) => {
        if (data.status) {
          this.setState({ isFreeToJoin: true })
        } else {
          this.setState({ isFreeToJoin: false })

        }

      })
    }
  }

  //this function will create transport to send your strean
  createSendTransport = () => {
    // see server's socket.on('createWebRtcTransport', sender?, ...)
    // this is a call from Producer, so sender = true
    this.state.socket.emit('createWebRtcTransport', { consumer: false }, ({ params }) => {
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
      this.setState({ producerTransport: this.state.device.createSendTransport(params) })

      // https://mediasoup.org/documentation/v3/communication-between-client-and-server/#producing-media
      // this event is raised when a first call to transport.produce() is made
      // see connectSendTransport() below
      this.state.producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          // Signal local DTLS parameters to the server side transport
          // see server's socket.on('transport-connect', ...)
          await this.state.socket.emit('transport-connect', {
            dtlsParameters,
          })

          // Tell the transport that parameters were transmitted.
          callback()

        } catch (error) {
          errback(error)
        }
      })

      this.state.producerTransport.on('produce', async (parameters, callback, errback) => {
        console.log(parameters)

        try {
          // tell the server to create a Producer
          // with the following parameters and produce
          // and expect back a server side producer id
          // see server's socket.on('transport-produce', ...)
          await this.state.socket.emit('transport-produce', {
            kind: parameters.kind,
            rtpParameters: parameters.rtpParameters,
            appData: parameters.appData,
          }, ({ id, producersExist }) => {
            // Tell the transport that parameters were transmitted and provide it with the
            // server side producer's id.
            callback({ id })

            // if producers exist, then join room
            if (producersExist) this.getProducers()
          })
        } catch (error) {
          errback(error)
        }
      })

      this.connectSendTransport()
    })
  }

  //this function will get all 
  // current producer from the server and counsume them
  getProducers = () => {
    this.state.socket.emit('getProducers', {
      isViewr: this.state.IsViewer,
      roomName: this.props.match.params.room
    }, producerIds => {
      console.log(producerIds)
      // for each of the producer create a consumer
      // producerIds.forEach(id => signalNewConsumerTransport(id))
      producerIds.forEach(producer => this.signalNewConsumerTransport(producer[0], producer[1]))
    })
  }

  //connect the rescv transport
  connectRecvTransport = async (consumerTransport, remoteProducerId, socketId, serverConsumerTransportId) => {
    // for consumer, we need to tell the server first
    // to create a consumer based on the rtpCapabilities and consume
    // if the router can consume, it will send back a set of params as below
    await this.state.socket.emit('consume', {
      rtpCapabilities: this.state.device.rtpCapabilities,
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
        ...this.state.consumerTransports,
        {
          consumerTransport,
          serverConsumerTransportId: params.id,
          producerId: remoteProducerId,
          consumer,
        },
      ]
      this.setState({ consumerTransports })
      const { track } = consumer

      //add the new stream to the view 
      this.AddMediaStream(socketId, new MediaStream([track]))

      // the server consumer started with media paused
      // so we need to inform the server to resume
      this.state.socket.emit('consumer-resume', { serverConsumerId: params.serverConsumerId })
    })
  }

  //this function will connect our send transport to the server
  connectSendTransport = async () => {
    // we now call produce() to instruct the producer transport
    // to send media to the Router
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
    // this action will trigger the 'connect' and 'produce' events above
    console.log(this.state.params)
    let producer = await this.state.producerTransport.produce(this.state.params)
    this.setState({ producer })
    this.state.producer.on('trackended', () => {
      console.log('track ended')

      // close video track
    })

    this.state.producer.on('transportclose', () => {
      console.log('transport ended')

      // close video track
    })
  }

  //this function called when user quit the room
  // it will clear his postion it the guist list
  // and close the side bar
  completeSession(id) {
    //remove the socket from thw queu list
    //if(this.state.queueGuest[id]) this.setState({queueGuest:[...this.state.queueGuest.filter(guest=>guest!==id)]})

    var guestList = [...this.state.guest];

    let thegustid;

    guestList.forEach((geist, i) => {
      if (geist[1] === id) {
        console.log(i)
        geist[1] = 0;
        thegustid = i;

      }

    })

    this.setState({ guest: guestList })
    this.CloseTheSideCaller(thegustid);


  };



  render() {

    return (
      <React.Fragment>

        <ToastContainer />

        <canvas ref={this.canvas} className='d-none' width='280' height='200' id="canvas"></canvas>

        <div className="container-fluid	">

          <div className="row ">
            <br></br>
            <br></br>

          </div>
          <br></br>

          <div style={!this.state.IsViewer ? { display: 'none' } : { display: 'block' }} className="custom-control custom-switch">
            <div style={!this.state.isFreeToJoin ? { display: 'none' } : { display: 'block' }} className="custom-control custom-switch">
              <span
                onClick={this.JoinTheRoom} className="badge badge-primary btn ">
                Free window To Join

              </span>
            </div>
          </div>

            <div  style={!this.state.First ? { display: 'none' } : { display: 'block' }} className="custom-control custom-switch">
              <input
                onChange={this.LockRoom}
                type="checkbox"
                checked={this.state.Lock}
                className=" custom-control-input"
                name="Lock"

                id="customSwitch2">
              </input>
              <label className="custom-control-label" htmlFor="customSwitch2">Lock the rooms</label>
            </div>


            <div  style={!this.state.First ? { display: 'none' } : { display: 'block' }} className="custom-control custom-switch">
              <input
                onChange={this.HiddeTheRoom}
                type="checkbox"
                checked={this.state.HiddeTheRoom}
                className="d- custom-control-input"
                name="HiddeTheRoom"

                id="customSwitch3">
              </input>
              <label className="custom-control-label" htmlFor="customSwitch4">the rooms is not hidden</label>
            </div>

            <div  style={!this.state.First ? { display: 'none' } : { display: 'block' }} className="custom-control custom-switch">
              <input
                onChange={this.isStream}
                type="checkbox"
                checked={this.state.isStream}
                className="  custom-control-input"
                name="HiddeTheRoom"

                id="customSwitch4">
              </input>
              <label className="custom-control-label" htmlFor="customSwitch4">Stop public Streaming</label>
            </div>


          <div className="  row no-gutters   justify-content-md-center h-100 ">


            <div className={this.GetElemntCssClass(0) + ` chatback`}>
              <form className="form-inline h-80 justify-content-md-center ">
                <div className="h-100 w-80 overflow-auto">
                  <div className='mhchat'>
                    {this.state.HistoryChat}

                  </div>
                </div>
                <input
                  onChange={this.onChange}

                  type="text" className="w-80 form-control"
                  value={this.state.ChatMessage}
                  name="ChatMessage" placeholder="Chat here">

                </input>

                <button type="submit"
                  onClick={this.SendMessageChat} className=" btn sendc">
                </button>
                <div className="input-group-prepend"></div>
              </form>
            </div>

            <div className={this.GetElemntCssClass(1)}>

              <div
                className={`${this.IsVedioElemntVisble(this.state.guest[1][1]) ? 'visible' : 'd-none'}  `}>
                <video
                  ref={this.state.guest[1][0]}
                  className="Vd-box h-0 w-100" autoPlay >
                </video>
                <span onClick={() => this.ToogleBox(this.state.guest[1])} className=" video-controls btn"></span>

              </div>

              <div
                className={`${this.IsVedioElemntVisble(this.state.guest[2][1]) ? 'visible' : 'd-none'}  `}>
                <video ref={this.state.guest[2][0]} className="Vd-box h-0 w-100" autoPlay>
                </video>

                <span onClick={() => this.ToogleBox(this.state.guest[2])} className="  video-controls btn"></span>

              </div>

            </div>


            <div className={this.GetElemntCssClass(2) + ` `}>


              <video
                ref={this.state.guest[0][0]} autoPlay
                className="Vd-box h-0 w-100 ">
              </video>
              <span
                onClick={() => this.ToogleBox(this.state.guest[0])}
                className={`${!this.state.First ? 'visible' : 'd-none'}  video-controls btn `}
              ></span>

            </div>

            <div className={this.GetElemntCssClass(3)}>



              <div
                className={`${this.IsVedioElemntVisble(this.state.guest[3][1]) ? 'visible' : 'd-none'}  `}>
                <video ref={this.state.guest[3][0]} className="Vd-box h-0 w-100" autoPlay>
                </video>

                <span onClick={() => this.ToogleBox(this.state.guest[3])} className="  video-controls btn"></span>

              </div>


              <div
                className={`${this.IsVedioElemntVisble(this.state.guest[4][1]) ? 'visible' : 'd-none'}  `}>
                <video ref={this.state.guest[4][0]} className="Vd-box h-0 w-100" autoPlay>
                </video>

                <span onClick={() => this.ToogleBox(this.state.guest[4])} className="  video-controls btn"></span>

              </div>


            </div>
            <div className="SideBarChat">


              <button type="submit" onClick={() => this.ToggleElementCssClass(0)}
                className={`${this.GetElemntCssClass(0) === 'd-none' ? 'OpenChat' : 'CloseChat'} btn`}></button>
            </div>
          </div>
        </div>
        <Footer></Footer>
        <Modal admin={this.state.First}
          Id={this.state.guest[0]}
          KikHimOut={this.KikHimOut}
          onChange={this.onChange}
          ToogleBox={this.ToogleBox}
          PrivetMessage={this.state.PrivetMessage}
          SendPrivetMessage={this.SendPrivetMessage}
          removeUserFromRoom={this.removeUserFromRoom}></Modal>

        <Modal admin={this.state.First}
          Id={this.state.guest[1]}
          KikHimOut={this.KikHimOut}
          onChange={this.onChange}
          ToogleBox={this.ToogleBox}
          PrivetMessage={this.state.PrivetMessage}
          SendPrivetMessage={this.SendPrivetMessage}
          removeUserFromRoom={this.removeUserFromRoom}></Modal>

        <Modal admin={this.state.First}
          onChange={this.onChange}
          Id={this.state.guest[2]}
          KikHimOut={this.KikHimOut}
          ToogleBox={this.ToogleBox}
          PrivetMessage={this.state.PrivetMessage}
          SendPrivetMessage={this.SendPrivetMessage}
          removeUserFromRoom={this.removeUserFromRoom}></Modal>


        <Modal admin={this.state.First}
          Id={this.state.guest[3]}
          onChange={this.onChange}
          KikHimOut={this.KikHimOut}
          ToogleBox={this.ToogleBox}
          PrivetMessage={this.state.PrivetMessage}
          SendPrivetMessage={this.SendPrivetMessage}
          removeUserFromRoom={this.removeUserFromRoom}></Modal>


        <Modal admin={this.state.First}
          onChange={this.onChange}
          Id={this.state.guest[4]}
          KikHimOut={this.KikHimOut}
          ToogleBox={this.ToogleBox}
          PrivetMessage={this.state.PrivetMessage}
          SendPrivetMessage={this.SendPrivetMessage}
          removeUserFromRoom={this.removeUserFromRoom}></Modal>

      </React.Fragment>
    );
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
  ,
  params:                     // mediasoup configratio params
  {

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

}
export default withRouter(CallBord);


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