import {
  SET_DEVICE,
  DELETE_DEVICE,
  ADD_PARAM,
  ADD_PRODUCER_TRANSPORT,
  REMOVE_PRODUCER_TRANSPORT,
  ADD_CONSUMER_TRANSPORT,
  REMOVE_CONSUMER_TRANSPORT,
} from "./Type";

const initialMediaSoupProps = {
  device: null,
  producerTransport: false,
  consumerTransports: [],
  params
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