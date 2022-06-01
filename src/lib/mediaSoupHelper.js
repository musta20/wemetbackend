import { Device } from "mediasoup-client";
import { useEffect, useState , useCallback} from "react";

export const useMediaSoupHelper = (
  Socket,
  IsViewer,
  Room,
  setisFreeToJoin,
  AddMediaStream,
  completeSession
) => {
  const [device, setDevice] = useState(null);
  const [producerTransport, setproducerTransport] = useState(false);
  const [consumerTransports, setConsumerTransports] = useState([]);

  const [params, setParam] = useState({
    // mediasoup configratio params

    encodings: [
      {
        rid: "r0",
        maxBitrate: 100000,
        scalabilityMode: "S1T3",
      },
      {
        rid: "r1",
        maxBitrate: 300000,
        scalabilityMode: "S1T3",
      },
      {
        rid: "r2",
        maxBitrate: 900000,
        scalabilityMode: "S1T3",
      },
    ],
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
    codecOptions: {
      videoGoogleStartBitrate: 1000,
    },
  });



  const Unmount = 

    (producerTransportclose) => {

      try {

        Socket.emit('leave',{name :"leav"},(e)=>{
          console.log(e)
        })
        return
        console.log('CLOSE THE SENDING TRANSPORT')
        //close the send  producer transport
        //console.log(producerTransport)
      console.log(producerTransportclose)
        if(producerTransportclose===null) return
        producerTransportclose.close()
    
      } catch (error) {
        
      }
      
  
      // Socket.leav()
    
      
  
      try {
        //close all the consumer transport
       // console.log(consumerTransports.length)
        if(!consumerTransports.length) return
  
        consumerTransports.forEach(Transports => {
          if(Transports===null) return
  
          Transports.consumerTransport.close()
          Transports.consumer.close()
        });
  
      } catch (e) {
        console.log(e)
  
      }
  
       }
  
   //    const closePageproducerTransport = useCallback(()=>Unmount(producerTransport),[])




  



  //this function will set listner for in and out calls
  const setMediaSoupListner = () => {
    //this event new-prouducer triggerd a new user is joined the room and
    // you gone resive his stream via producerId and socketId is his socket id
    Socket.on("new-producer", async ({ producerId, socketId }) => {
      console.log(
        "NEW PERSON JUST JOINED THE MEETING ===================>>>>>>>>>>>>>>>>>>>>>"
      );
      //console.log(queueGuest)
      //if(queueGuest[socketId]) return
      //setState({queueGuest:[...queueGuest,socketId]})
      console.log(producerId);
      console.log(socketId);
      await signalNewConsumerTransport(producerId, socketId, false);
    });
    //this event triggred when user colse his stram you shuld close
    //the connection to prevent memory leak

    Socket.on("producer-closed", ({ remoteProducerId, socketId }) => {

      //find the specifc transport and close it
      try {
        const producerToClose = consumerTransports.find(
          (transportData) => transportData.producerId === remoteProducerId
        );
        producerToClose.consumerTransport.close();
        producerToClose.consumer.close();
      } catch (e) {
        console.error(e);
      }
      // remove the consumer transport from the list

      let ConsumerTransports = [
        ...consumerTransports.filter(
          (transportData) => transportData.producerId !== remoteProducerId
        ),
      ];

      setConsumerTransports(ConsumerTransports);
      // hide the video div element
       completeSession(socketId);
    });
  };

  //this function will create a device for mediasoup api
  const createDevice = async (routerRtpCapabilities) => {
    // console.log("START CREATING THE DIVICE");
    try {
      let device = new Device();

      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
      // Loads the device with RTP capabilities of the Router (server side)
      // let routerRtpCapabilities = rtpCapabilities
      // let cap = {routerRtpCapabilities: rtpCapabilities};
      // console.error("rtp capapltet");
      // console.log(routerRtpCapabilities);

      await device.load({ routerRtpCapabilities });

      setDevice(device);

      //   console.log(`the viewr case IS: ${IsViewer}`);
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
  const signalNewConsumerTransport = async (
    remoteProducerId,
    socketId,
    kok
  ) => {
    console.log("signalNewConsumerTransport");
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
              console.log("CONSUME TRUANSPORT");
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
          params.id,
          kok
        );
      }
    );
    //if viewr check if room is avalipee to join
    if (IsViewer) {
      Socket.emit("isFreeToJoin", { roomName: Room }, (data) => {
        if (data.status) {
          setisFreeToJoin(true);
        } else {
          setisFreeToJoin(false);
        }
      });
    }
  };

  //this function will create transport to send your strean
  const createSendTransport = () => {
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
          console.log("IAM STARTING TO PRODUCE");

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
                console.log(producersExist);
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
      setproducerTransport(pproducerTransport);
    });
  };

  //this function will get all
  // current producer from the server and counsume them
  const getProducers = () => {
    console.log("THIS IS GET PRODUCESS");

    Socket.emit(
      "getProducers",
      {
        isViewr: IsViewer,
        roomName: Room,
      },
      (producerIds) => {
        console.log(producerIds);
        // for each of the producer create a consumer
        // producerIds.forEach(id => signalNewConsumerTransport(id))
        producerIds.forEach(
          (
            producer //console.log(producer)
          ) => signalNewConsumerTransport(producer[0], producer[1], true)
        );
      }
    );
  };

  //connect the rescv transport
  const connectRecvTransport = async (
    consumerTransport,
    remoteProducerId,
    socketId,
    serverConsumerTransportId,
    kok
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
          console.log("Cannot Consume");
          return;
        }

        //console.log(`Consumer Params ${params}`);
        // console.log(params);
        // then consume with the local consumer transport
        // which creates a consumer
        const consumer = await consumerTransport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
        });

        let ConsumerTransports = [
          ...consumerTransports,
          {
            consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: remoteProducerId,
            consumer,
          },
        ];

        setConsumerTransports(ConsumerTransports);

        const { track } = consumer;

        //add the new stream to the view
        try {
          AddMediaStream(socketId, new MediaStream([track]), kok);
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
    console.log("CONNECT THE SEND TRANSPORT");
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

    //if the user is not viewr create send transport
    if (!IsViewer) {
      // once the device loads, create transport
      if (params.track && device && !producerTransport) {
        createSendTransport(device);
        setMediaSoupListner();
      }
    } else {
      //get the current producers and chek if joining the room is avaliple
      getProducers();

      Socket.emit("isFreeToJoin", { roomName: Room }, (data) => {
        if (data.status) {
          setisFreeToJoin(true);
        } else {
          setisFreeToJoin(false);
        }
      });
    }


  }, [device, IsViewer, params, producerTransport]);
  
useEffect(()=>{

  return ()=>{
    Unmount(producerTransport)
  }

},[])



  return {
    startStreming: createDevice,
    setParam: setParam,
    params:params
  };
};
