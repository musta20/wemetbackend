import { createContext } from "react";
import massengerReducer from "../Reducers/massengerReducer";
import mediaSoupReducer from "../Reducers/mediaSoupReducer";
import roomHelperReducer from "../Reducers/roomHelperReducer";
const initialMainRoomProps = {
  roomName: "",
  isPublic: true,
  isStreamed: true,
  adminId: 0,
  isJoinedTheRoom: false,
  guestList: [],
};

const [roomState, roomDispatch] = useReducer(
  roomHelperReducer,
  initialMainRoomProps
);
const [mediaSoupstate, mediaSoupDispatch] = useReducer(
  mediaSoupReducer,
  initialMainRoomProps
);
const [massengerstate, massengerDispatch] = useReducer(
  massengerReducer,
  initialMainRoomProps
);

export const MainRoomContex = {
  massengerstate,
  massengerDispatch,
  roomState,
  roomDispatch,
  mediaSoupstate,
  mediaSoupDispatch,
};

export const AppContext = createContext();
