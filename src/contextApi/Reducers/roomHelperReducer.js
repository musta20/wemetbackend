import {
  ADD_ROOM_NAME,
  SET_IS_ROOM_PUBLIC,
  SET_IS_ROOM_STRMED,
  SET_ADMIN_ID,
  IS_JOINED_THE_ROOM,
  ADD_TO_GUEST_LIST,
  REMOVE_FROM_GUEST_LIST,
} from "./Type";

const initialMainRoomProps = {
  roomName: "",
  isPublic: true,
  isStreamed: true,
  adminId: 0,
  isJoinedTheRoom: false,
  guestList: [],
  isFreeToJoin: false,
};

const roomHelperReducer = (state, action) => {
  switch (action.type) {
    case REMOVE_FROM_GUEST_LIST:
        return {
          ...state,
          guestList: [...guestList].filter(item=>item[1] !== action.pyload)
        };
    case ADD_TO_GUEST_LIST:
        return {
          ...state,
          guestList: [...guestList].push(action.pyload)
        };
    case IS_JOINED_THE_ROOM:
        return {
          ...state,
          isJoinedTheRoom: action.pyload,
        };
    case SET_ADMIN_ID:
        return {
          ...state,
          adminId: action.pyload,
        };
    case SET_IS_ROOM_STRMED:
        return {
          ...state,
          isStreamed: action.pyload,
        };
    case SET_IS_ROOM_PUBLIC:
        return {
          ...state,
          isPublic: action.pyload,
        };
    case ADD_ROOM_NAME:
      return {
        ...state,
        roomName: action.pyload,
      };
    default:
      break;
  }
};

export default roomHelperReducer;
