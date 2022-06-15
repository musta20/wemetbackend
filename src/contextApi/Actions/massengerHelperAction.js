import {
  ADD_CHAT_MESSAGE,
  ADD_PRIVET_MESSAGE,
  ADD_MESSAGE_TO_CHAT,
} from "./Type";

export const addChatMessage = (message, dispatch) => {
  dispatch({ payload: message, type: ADD_CHAT_MESSAGE });
};

export const addPrivetMessage = (message, dispatch) => {
  dispatch({ payload: message, type: ADD_PRIVET_MESSAGE });
};

export const addMessageToChat = (message, dispatch) => {
  dispatch({ payload: message, type: ADD_MESSAGE_TO_CHAT });
};
