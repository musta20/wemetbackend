
import { AppContext } from "../../contextApi/Contexts/AppContext";

import { useContext } from "react";

import {isRoomPublic} from "../../contextApi/Actions/roomHelperAction"
import { SocketContext } from "../../contextApi/Contexts/socket";
const ControlePanle = () => {

  const { mediaSoupstate, mediaSoupDispatch, roomState, roomDispatch } =
    useContext(AppContext);
    const Socket = useContext(SocketContext);

    const {isJoinedTheRoom ,isStreamed,adminId, isPublic,isFreeToJoin}=roomState;
    //this function will lock the room
  // the server will check if you are the admin
  const LockRoom = (e) => {
    //  setLock(e.target.checked);
    isRoomPublic(e.target.checked,mediaSoupDispatch)  
    //Socket.emit("LockTheRoom", Lock, (data) => {});
    };
  
      //this function will hide the room
    // the server will check if you are the admin
    const doHiddeTheRoom = (e) => {
      //setHiddeTheRoom(e.target.checked);
     // Socket.emit("HiddeTheRoom", Lock, (data) => {});
    };
const isStream = ()=>{

}
    const JoinTheRoom = ()=>{}
  
  return (
    <>
      <div
        style={!isJoinedTheRoom ? { display: "none" } : { display: "block" }}
        className="custom-control custom-switch"
      >
        <div
          style={!isFreeToJoin ? { display: "none" } : { display: "block" }}
          className="custom-control custom-switch"
        >
          <span onClick={JoinTheRoom} className="badge badge-primary btn ">
            Free window To Join
          </span>
        </div>
      </div>

      <div
        style={!!adminId === Socket.id ? { display: "none" } : { display: "block" }}
        className="custom-control custom-switch"
      >
        <input
          onChange={(e) => LockRoom(e)}
          type="checkbox"
          checked={isStreamed}
          className=" custom-control-input"
          name="Lock"
          id="customSwitch2"
        ></input>
        <label className="custom-control-label" htmlFor="customSwitch2">
          Lock the rooms
        </label>
      </div>

      <div
        style={!adminId === Socket.id ? { display: "none" } : { display: "block" }}
        className="custom-control custom-switch"
      >
        <input
          onChange={(e) => doHiddeTheRoom(e)}
          type="checkbox"
          checked={isPublic}
          className="d- custom-control-input"
          name="HiddeTheRoom"
          id="customSwitch3"
        ></input>
        <label className="custom-control-label" htmlFor="customSwitch4">
          the rooms is not hidden
        </label>
      </div>

      <div
        style={!adminId === Socket.id ? { display: "none" } : { display: "block" }}
        className="custom-control custom-switch"
      >
        <input
          onChange={(e) => isStream(e)}
          type="checkbox"
          checked={isStreamed}
          className="  custom-control-input"
          name="HiddeTheRoom"
          id="customSwitch4"
        ></input>
        <label className="custom-control-label" htmlFor="customSwitch4">
          Stop public Streaming
        </label>
      </div>
    </>
  );
};

export default ControlePanle;