import {
  SET_DEVICE,
  DELETE_DEVICE,
  ADD_PARAM,
  ADD_PRODUCER_TRANSPORT,
  REMOVE_PRODUCER_TRANSPORT,
  ADD_CONSUMER_TRANSPORT,
  REMOVE_CONSUMER_TRANSPORT,
} from "../Actions/Type";

const initialMediaSoupProps = {
  device: null,
  producerTransport: false,
  consumerTransports: [],
  params:{
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
  }
};

const mediaSoupReducer = (state, action) => {
  switch (action.type) {
    case SET_DEVICE:
      return {
        ...state,
        param: action.pyload,
      };
      case ADD_PARAM:
        return {
          ...state,
          device: action.pyload,
        };
    case DELETE_DEVICE:
      return {
        ...state,
        device: null,
      };
    case ADD_PRODUCER_TRANSPORT:
      return {
        ...state,
        producerTransport: action.pyload,
      };
    case REMOVE_PRODUCER_TRANSPORT:
      return {
        ...state,
        producerTransport: null,
      };
    case ADD_CONSUMER_TRANSPORT:
      return {
        ...state,
        consumerTransports: [...consumerTransports].push(action.pyload),
      };
    case REMOVE_CONSUMER_TRANSPORT:
      return {
        state,
        consumerTransports: [...consumerTransports].filter(
          (transportData) => transportData.producerId !== action.pyload
        ),
      };

    default:
      break;
  }
};

export default mediaSoupReducer;