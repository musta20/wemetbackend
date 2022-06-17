import {
  ADD_ROOM_NAME,
  SET_IS_ROOM_PUBLIC,
  SET_IS_ROOM_STRMED,
  SET_ADMIN_ID,
  IS_JOINED_THE_ROOM,
  ADD_TO_GUEST_LIST,
  REMOVE_FROM_GUEST_LIST,
  UP_DATE_GUEST_LIST,
  SET_USER_MEDIA
} from "../Actions/Type";
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
    case SET_USER_MEDIA:
      return {
        ...state,
        userTrack: action.payload
      };
    case REMOVE_FROM_GUEST_LIST:
        return {
          ...state,
          guestList: [...state.guestList].filter(item=>item[1] !== action.payload)
        };
    case ADD_TO_GUEST_LIST:
        return {
          ...state,
          guestList: [...state.guestList].push(action.payload)
        };
    case IS_JOINED_THE_ROOM:
        return {
          ...state,
          isJoinedTheRoom: action.payload,
        };
    case SET_ADMIN_ID:
        return {
          ...state,
          adminId: action.payload,
        };
    case SET_IS_ROOM_STRMED:
        return {
          ...state,
          isStreamed: action.payload,
        };
    case SET_IS_ROOM_PUBLIC:
        return {
          ...state,
          isPublic: action.payload,
        };
    case ADD_ROOM_NAME:
      return {
        ...state,
        roomName: action.payload,
      };
      case UP_DATE_GUEST_LIST:
        return {
          ...state,
          guestList: action.payload,
        };
    default:
      break;
  }
};

export default roomHelperReducer;
