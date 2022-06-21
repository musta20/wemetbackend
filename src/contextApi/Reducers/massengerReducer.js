import { ADD_CHAT_MESSAGE, ADD_PRIVET_MESSAGE , ADD_MESSAGE_TO_CHAT ,REST_STATE} from "../Actions/Type";
const initialMassengerProps = {
  HistoryChat: [],
  ChatMessage: "",
  PrivetMessage: "",
};

const massengerReducer = (state, action) => {
  switch (action.type) {

    case REST_STATE:
      return action.payload;
    case ADD_CHAT_MESSAGE:
      return {
        ...state,
        HistoryChat: action.payload,
      };
    case ADD_PRIVET_MESSAGE:
      return {
        ...state,
        PrivetMessage: action.payload,
      };
    case ADD_MESSAGE_TO_CHAT:
      return {
        ...state,
        HistoryChat: [...state.HistoryChat].push(action.payload),
      };
    default:
      break;
  }
};
export default massengerReducer;