import { ADD_CHAT_MESSAGE, ADD_PRIVET_MESSAGE , ADD_MESSAGE_TO_CHAT } from "./Type";
const initialMassengerProps = {
  HistoryChat: [],
  ChatMessage: "",
  PrivetMessage: "",
};

const massengerReducer = (state, action) => {
  switch (action.type) {
    case ADD_CHAT_MESSAGE:
      return {
        ...state,
        HistoryChat: action.pyload,
      };
    case ADD_PRIVET_MESSAGE:
      return {
        ...state,
        PrivetMessage: action.pyload,
      };
    case ADD_MESSAGE_TO_CHAT:
      return {
        ...state,
        HistoryChat: [...HistoryChat].push(action.pyload),
      };
    default:
      break;
  }
};
export default massengerReducer;