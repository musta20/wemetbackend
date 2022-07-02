import { AppContext } from "../../contextApi/Contexts/AppContext";

import { useContext } from "react";

import { isRoomPublic } from "../../contextApi/Actions/roomHelperAction";
import { SocketContext } from "../../contextApi/Contexts/socket";
import { useNavigate } from "react-router-dom";

import { setIsFreeToJoin } from "../../contextApi/Actions/roomHelperAction";
const ControlePanle = () => {
  const { mediaSoupstate, mediaSoupDispatch, roomState, roomDispatch } =
    useContext(AppContext);
  const Socket = useContext(SocketContext);

  const { isAudience, roomName, isStreamed, adminId, isPublic, isFreeToJoin } =
    roomState;

  const navigate = useNavigate();

  /* 
    console.log('THE C PANALE VALUES ')
    console.log(isStreamed)
    console.log(isAudience)
    console.log(isPublic)
    console.log(isFreeToJoin) */
  //this function will lock the room
  // the server will check if you are the admin
  const LockRoom = (e) => {
    //  setLock(e.target.checked);
    isRoomPublic(e.target.checked, mediaSoupDispatch);
    //Socket.emit("LockTheRoom", Lock, (data) => {});
  };

  //this function will hide the room
  // the server will check if you are the admin
  const doHiddeTheRoom = (e) => {
    //setHiddeTheRoom(e.target.checked);
    // Socket.emit("HiddeTheRoom", Lock, (data) => {});
  };
  const isStream = () => {};
  const JoinTheRoom = () => {
    //  setIsFreeToJoin(false,roomDispatch)
    console.log("roomName  JoinTheRoom JoinTheRoom");
    console.log(roomName);

    navigate("/Switcher", {
      state: {
        roomName: roomName,
        IsPublic: true,
        IsViewer: false,
      },
    });
  };

  return (
    <>
      <button
        onClick={() => JoinTheRoom()}
        className={`${!isFreeToJoin ? "d-none" : ""} btn btn-sm`}
      >
        Free window To Join
      </button>
      <div
        style={!isAudience ? { display: "none" } : { display: "block" }}
        className="custom-control custom-switch"
      ></div>

      <span
        style={
          adminId !== Socket.id ? { display: "none" } : { display: "block" }
        }
      >
        <div className="custom-control custom-switch">
          <input
            onChange={(e) => LockRoom(e)}
            type="checkbox"
            checked={isStreamed}
            className=" custom-control-input"
            name="Lock"
            id="customSwitch2"
          ></input>
          <label className="custom-control-label" htmlFor="customSwitch2">
            Streaming
          </label>

          <div className="custom-control custom-switch">
            <input
              onChange={(e) => doHiddeTheRoom(e)}
              type="checkbox"
              checked={isPublic}
              className="d- custom-control-input"
              name="HiddeTheRoom"
              id="customSwitch3"
            ></input>
            <label className="custom-control-label" htmlFor="customSwitch4">
              Puplic
            </label>
          </div>

          <div className="custom-control custom-switch">
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
        </div>
      </span>
    </>
  );
};

export default ControlePanle;
