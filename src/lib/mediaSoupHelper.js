import { Device } from 'mediasoup-client';
import { useEffect , useState} from 'react';

export const useMediaSoupHelper = (Socket)=>{

    const [device,setDevice] = useState(null);
    const [producerTransport,setproducerTransport] = useState(false);

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

  //this function will create a device for mediasoup api
  const createDevice = async (routerRtpCapabilities ) => {
    console.log('START CREATING THE DIVICE')
     try {
       let device = new Device()
 
       // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
       // Loads the device with RTP capabilities of the Router (server side)
       // let routerRtpCapabilities = rtpCapabilities
      // let cap = {routerRtpCapabilities: rtpCapabilities};
       console.error('rtp capapltet')
       console.log(routerRtpCapabilities)
       
       await device.load({routerRtpCapabilities});
 
       setDevice(device )
 
       console.log('CHECKING THE VIEWER STATUS BEFOR CREATE SEND TEANSPORT')
       console.log(`the viewr case IS: ${IsViewer}`)
 
 
     } catch (error) {
       console.warn('browser not supported')
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

 
       // creates a new WebRTC Transport to send media
       // based on the server's producer transport params
       // https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
       let producerTransport = device.createSendTransport(params)
       // https://mediasoup.org/documentation/v3/communication-between-client-and-server/#producing-media
       // this event is raised when a first call to transport.produce() is made
       // see connectSendTransport() below
       producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
         console.log('PRODUCER TRANSPORT CONNECTION FIRED')
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
         console.log('IAM STARTING TO PRODUCE')
 
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

       setproducerTransport(device.createSendTransport(params))

 
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
   const connectSendTransport = async (producerTransport) => {
     // we now call produce() to instruct the producer transport
     // to send media to the Router
     // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
     // this action will trigger the 'connect' and 'produce' events above
     console.log('CONNECT THE SEND TRANSPORT')
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

 useEffect(()=>{
           //if the user is not viewr create send transport
           if (!IsViewer) {
            // once the device loads, create transport
           if(param.track) createSendTransport(device)
    
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
 },[device,param])

 useEffect(()=>{
  if(producerTransport) connectSendTransport(producerTransport)

 },[producerTransport])


   return {
    connectSendTransport:connectSendTransport
    ,
    connectRecvTransport:connectRecvTransport
    ,
    signalNewConsumerTransport:signalNewConsumerTransport,

    getProducers:getProducers
    ,
    startStreming:createDevice
    ,
    setParam:setParam
   }
 


}