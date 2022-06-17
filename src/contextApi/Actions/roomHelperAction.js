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
  } from "./Type";



  export const  setRoomName = (name ,dispatch) =>{
  
    dispatch({payload:name,type:ADD_ROOM_NAME})
  
  }
  
  export const  isRoomPublic = (isRoompublic ,dispatch) =>{
  
    dispatch({payload:isRoompublic,type:SET_IS_ROOM_PUBLIC})
  
  }
  
  export const  isRoomStream = (IsRoomStream ,dispatch) =>{
  
    dispatch({payload:IsRoomStream,type:SET_IS_ROOM_STRMED})
  
  }
  
  export const  setAdminId = (Id ,dispatch) =>{
  
    dispatch({payload:Id,type:SET_ADMIN_ID})
  
  }
  
  export const  isJoinedTheRoom = (joinedTheRoom ,dispatch) =>{
  
    dispatch({payload:joinedTheRoom,type:IS_JOINED_THE_ROOM})
  
  }
  export const  setUserMedia = (Track ,dispatch) =>{
  
    dispatch({payload:Track,type:SET_USER_MEDIA})
  
  }
  
  
  export const  addToGuestList = (Guest ,dispatch) =>{
  
    dispatch({payload:Guest,type:ADD_TO_GUEST_LIST})
  
  }
  
  export const  removeFromGuestList = (Guest ,dispatch) =>{
  
    dispatch({payload:Guest,type:REMOVE_FROM_GUEST_LIST})
  
  }
  
  export const  upDateGuestList = (Guest ,dispatch) =>{
  
    dispatch({payload:Guest,type:UP_DATE_GUEST_LIST})
  
  }