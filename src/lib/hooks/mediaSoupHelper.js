import { Device } from "mediasoup-client";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../contextApi/Contexts/AppContext";
import {
  setDevice,
  addProducerTransport,
  addConsumerTransport,
} from "../../contextApi/Actions/mediaSoupAction";

import { SocketContext } from "../../contextApi/Contexts/socket";
import {
  upDateGuestList,
  setIsFreeToJoin,
} from "../../contextApi/Actions/roomHelperAction";

export const useMediaSoupHelper = () => {
  const {
    mediaSoupstate,
    mediaSoupDispatch,
    roomDispatch,
    roomState,
    restAllState,
  } = useContext(AppContext);
  const Socket = useContext(SocketContext);

  const { device, params, producerTransport, consumerTransports } =
    mediaSoupstate;

  const { roomName, adminId, userMediaTrack, isAudience, guestList } =
    roomState;

  const Unmount = () => {
    Socket.emit("leave", { name: "leav" }, () => {});

    Socket.disconnect();
    restAllState();
  };

  //this function will set listner for in and out calls
  const setMediaSoupListner = () => {
    //this event new-prouducer triggerd a new user is joined the room and
    // you gone resive his stream via producerId and socketId is his socket id
    Socket.off("new-producer").on(
      "new-producer",
      async ({ producerId, socketId }) => {

    /*     console.log(
          "NEW   JOINED   ===================>>>>>>>>>>>>>>>>>>>>>"
        );
 */
      

        signalNewConsumerTransport(producerId, socketId);
      }
    );
    //this event triggred when user colse his stram you shuld close
    //the connection to prevent memory leak

    Socket.on("producer-closed", ({ remoteProducerId, socketId }) => {
      //find the specifc transport and close it

//console.log(mediaSoupstate)
      try {
        const producerToClose = consumerTransports.find(
          (transportData) => transportData.producerId === remoteProducerId
        );
        if (producerToClose){  producerToClose.consumerTransport.close();}
        if (producerToClose){ producerToClose.consumer.close();}
      } catch (e) {
        console.error(e);
      }
      // remove the consumer transport from the list
      
     // console.log(consumerTransports.length)
      let ConsumerTransports = [
        ...consumerTransports.filter(
          (transportData) => transportData.producerId !== remoteProducerId
        ),
      ];
     // console.log(consumerTransports.length)

      addConsumerTransport(ConsumerTransports, mediaSoupDispatch);
      // setConsumerTransports(ConsumerTransports);
      // hide the video div element
      completeSession(socketId);
    });
  };
  const completeSession = (id) => {
    const copyGuesList = [...guestList];

   // console.log(`CLOSE ING THE ID: ${id} `);
   // console.log(copyGuesList);

    const indexGuest = copyGuesList.findIndex((item) => item.id === id);

    if (indexGuest < 0) {
     // console.log("NAGATIV VALUE");
     // console.log(indexGuest);
    } else {
    //  console.log("ttis shudl fir if index is poaitc valie");
     // console.log(indexGuest);

      copyGuesList[indexGuest].id = 0;
      copyGuesList[indexGuest].feed.current.srcObject = null;
      upDateGuestList(copyGuesList, roomDispatch);
    }

   // console.log(copyGuesList);

  };

  //this function will create a device for mediasoup api
  const createDevice = async (routerRtpCapabilities) => {
  //  console.log("START CREATING THE DIVICE");
    try {
      let newDevice = new Device();

      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
      // Loads the device with RTP capabilities of the Router (server side)
      // let routerRtpCapabilities = rtpCapabilities
      // let cap = {routerRtpCapabilities: rtpCapabilities};
      // console.error("rtp capapltet");
      // console.log(routerRtpCapabilities);

      await newDevice.load({ routerRtpCapabilities });

      setDevice(newDevice, mediaSoupDispatch);

      //   console.log(`the viewr case IS: ${isAudience}`);
    } catch (error) {
      console.warn("browser not supported");
      console.log(error);
      if (error.name === "UnsupportedError")
        console.warn("browser not supported");
    }
  };

  /*
   this function used when new user joied the room and it take
   the remotpruducer and socketid create a recive transport
   and tell the server to create a consumer transport 
   */

  const signalNewConsumerTransport = async (remoteProducerId, socketId) => {
    await Socket.emit(
      "createWebRtcTransport",
      { consumer: true },
      ({ params }) => {
        // The server sends back params needed
        // to create Send Transport on the client side
        if (params.error) {
          console.log(params.error);
          return;
        }

        let consumerTransport;
        try {
          consumerTransport = device.createRecvTransport(params);
        } catch (error) {
          // exceptions:
          // {InvalidStateError} if not loaded
          // {TypeError} if wrong arguments.
          console.log(error);
          return;
        }

        consumerTransport.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            try {
             // console.log("CONSUME TRUANSPORT");
              // Signal local DTLS parameters to the server side transport
              // see server's Socket.on('transport-recv-connect', ...)
              await Socket.emit("transport-recv-connect", {
                dtlsParameters,
                serverConsumerTransportId: params.id,
              });

              // Tell the transport that parameters were transmitted.
              callback();
            } catch (error) {
              // Tell the transport that something was wrong
              errback(error);
            }
          }
        );
        //  if(kok) return
        // after createing the tranpsort connect to it
        connectRecvTransport(
          consumerTransport,
          remoteProducerId,
          socketId,
          params.id
        );
      }
    );
    //if viewr check if room is avalipee to join
    if (isAudience) {
      Socket.emit("isFreeToJoin", { roomName: roomName }, (data) => {
        if (data.status) {
          setIsFreeToJoin(true, roomDispatch);
        } else {
          setIsFreeToJoin(false, roomDispatch);
        }
      });
    }
  };

  //this function will create transport to send your strean
  const createSendTransport = () => {
   // console.log("IAM SENDING createSendTransport");
    // see server's Socket.on('createWebRtcTransport', sender?, ...)
    // this is a call from Producer, so sender = true
    // console.log(`the emtion came from here`);
    Socket.emit("createWebRtcTransport", { consumer: false }, ({ params }) => {
      // The server sends back params needed
      // to create Send Transport on the client side
      if (params.error) {
        console.log(params.error);
        return;
      }

      // creates a new WebRTC Transport to send media
      // based on the server's producer transport params
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
      let pproducerTransport = device.createSendTransport(params);
      // https://mediasoup.org/documentation/v3/communication-between-client-and-server/#producing-media
      // this event is raised when a first call to transport.produce() is made
      // see connectSendTransport() below
      pproducerTransport.on(
        "connect",
        async ({ dtlsParameters }, callback, errback) => {
          try {
            // Signal local DTLS parameters to the server side transport
            // see server's Socket.on('transport-connect', ...)
            await Socket.emit("transport-connect", {
              dtlsParameters,
            });

            // Tell the transport that parameters were transmitted.
            callback();
          } catch (error) {
            console.log(error);
            errback(error);
          }
        }
      );

      pproducerTransport.on(
        "produce",
        async (parameters, callback, errback) => {
         // console.log("IAM STARTING TO PRODUCE");

          try {
            // tell the server to create a Producer
            // with the following parameters and produce
            // and expect back a server side producer id
            // see server's Socket.on('transport-produce', ...)
            await Socket.emit(
              "transport-produce",
              {
                kind: parameters.kind,
                rtpParameters: parameters.rtpParameters,
                appData: parameters.appData,
              },
              ({ id, producersExist }) => {
                // Tell the transport that parameters were transmitted and provide it with the
                // server side producer's id.
                callback({ id });
             //   console.log(producersExist);
                // if producers exist, then join room
                //  setTimeout(() => {
                if (producersExist) getProducers();

                // }, 2000);
              }
            );
          } catch (error) {
            console.log(error);

            errback(error);
          }
        }
      );
      connectSendTransport(pproducerTransport);
      addProducerTransport(pproducerTransport, mediaSoupDispatch);
    });
  };

  //this function will get all
  // current producer from the server and counsume them
  const getProducers = () => {
    //console.log("THIS IS GET PRODUCESS");
    //console.log(roomName)

    Socket.emit(
      "getProducers",
      {
        isViewr: isAudience,
        roomName: roomName,
      },
      (producerIds) => {
        // for each of the producer create a consumer

        // producerIds.forEach(id => signalNewConsumerTransport(id))
        producerIds.forEach(
          (
            producer //console.log(producer)
          ) => signalNewConsumerTransport(producer[0], producer[1])
        );
      }
    );
  };

  const AddMediaStream = async (userid, stream) => {
   // console.log("%c AddMediaStream! ", "background: #222; color: #bada55");
    let copyGuesList = [...guestList];

    const isInGuestList = guestList.findIndex((item) => item.id === userid);


    if (userid === adminId) {
      //   const copyGuesList = [...guestList];
      // console.log("THE IS THA ADMIN REPLACE");
      copyGuesList[0].feed.current.srcObject = stream;
      copyGuesList[0].id = userid;

      ////  console.log("THE EMPTY SLOT");

      const indexOfEmptyVideo = copyGuesList.findIndex((item) => item.id === 0);
      if (!isAudience) {
        copyGuesList[indexOfEmptyVideo].id = Socket.id;
        copyGuesList[indexOfEmptyVideo].feed.current.srcObject = userMediaTrack;
      }

      await upDateGuestList(copyGuesList, roomDispatch);

      return;
    }

    if (isInGuestList > 0) {
      copyGuesList[isInGuestList].id = userid;
      copyGuesList[isInGuestList].feed.current.srcObject = stream;
    } else {
      const indexOfEmptyVideoVistir = guestList.findIndex(
        (item) => item.id === 0
      );

      copyGuesList[indexOfEmptyVideoVistir].id = userid;
      copyGuesList[indexOfEmptyVideoVistir].feed.current.srcObject = stream;
    }
    // waitToAdd(500,()=>{
    await upDateGuestList(copyGuesList, roomDispatch);

    //})

    //  upDateGuestList(guestlist, roomDispatch);
    // setGuest(guestlist);
  };


  //connect the rescv transport
  const connectRecvTransport = async (
    consumerTransport,
    remoteProducerId,
    socketId,
    serverConsumerTransportId
  ) => {
    // for consumer, we need to tell the server first
    // to create a consumer based on the rtpCapabilities and consume
    // if the router can consume, it will send back a set of params as below
    await Socket.emit(
      "consume",
      {
        rtpCapabilities: device.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,
      },
      async ({ params }) => {
        if (params.error) {
         // console.log(params.error)
         // console.log("Cannot Consume");
          return;
        }

        //console.log(`Consumer Params ${params}`);
        // console.log(params);
        // then consume with the local consumer transport
        // which creates a consumer
      //  console.log("ARE YOU CUNSUMIG SUN");
        const consumer = await consumerTransport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
        });

        const copyConsumerTransports = [
          ...consumerTransports,
          {
            consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: remoteProducerId,
            consumer,
          },
        ];
        
        addConsumerTransport(copyConsumerTransports, mediaSoupDispatch);

        const { track } = consumer;

        //add the new stream to the view
        try {
          AddMediaStream(socketId, new MediaStream([track]));
        } catch (error) {
          //      console.log(error);
        }
        // the server consumer started with media paused
        // so we need to inform the server to resume

        Socket.emit("consumer-resume", {
          serverConsumerId: params.serverConsumerId,
        });
      }
    );
  };

  //this function will connect our send transport to the server
  const connectSendTransport = async (pproducerTransport) => {
    // we now call produce() to instruct the producer transport
    // to send media to the Router
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
    // this action will trigger the 'connect' and 'produce' events above
    //console.log("CONNECT THE SEND TRANSPORT");
    //   console.log(params);

    let producer = await pproducerTransport.produce(params);

    // setProducer(producer);
    producer.on("trackended", () => {
      console.log("track ended");

      // close video track
    });

    producer.on("transportclose", () => {
      console.log("transport ended");

      // close video track
    });
  };

  useEffect(() => {
    //  console.log("USE EFFECT THIS BELOGN TO MEDIA SOUP HOOK");
    //if the user is not viewr create send transport

    if (!isAudience) {
      // once the device loads, create transport
      if (params?.track && device && !producerTransport) {
        // console.log("setMediaSoupListner SETTING THE ALL THE PARAMS");

        createSendTransport(device);
        setMediaSoupListner();
      }
    } else {
      //get the current producers and chek if joining the room is avaliple

      if (device) {
        //    console.log('GETPRODUCERS getProducers getProducers')
        setMediaSoupListner();

        getProducers();

        Socket.emit("isFreeToJoin", { roomName: roomName }, (data) => {
          if (data.status) {
            setIsFreeToJoin(true, roomDispatch);
          } else {
            setIsFreeToJoin(false, roomDispatch);
          }
        });
      }
    }
  }, [device, isAudience, params, producerTransport]);
  useEffect(() => {

  }, []);

  return {
    Unmount,
    startStreming: createDevice,
  };
};
