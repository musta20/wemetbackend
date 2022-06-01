const ControlePanle = ({
  IsViewer,
  isFreeToJoin,
  JoinTheRoom,
  LockRoom,
  Lock,
  doHiddeTheRoom,
  HiddeTheRoom,
  IsStream,
  isStream,
  First
}) => {
    console.log(`CONTROLE PANLE IS First`)
    console.log(First)
  return (
    <>
      <div
        style={!IsViewer ? { display: "none" } : { display: "block" }}
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
        style={!First ? { display: "none" } : { display: "block" }}
        className="custom-control custom-switch"
      >
        <input
          onChange={(e) => LockRoom(e)}
          type="checkbox"
          checked={Lock}
          className=" custom-control-input"
          name="Lock"
          id="customSwitch2"
        ></input>
        <label className="custom-control-label" htmlFor="customSwitch2">
          Lock the rooms
        </label>
      </div>

      <div
        style={!First ? { display: "none" } : { display: "block" }}
        className="custom-control custom-switch"
      >
        <input
          onChange={(e) => doHiddeTheRoom(e)}
          type="checkbox"
          checked={HiddeTheRoom}
          className="d- custom-control-input"
          name="HiddeTheRoom"
          id="customSwitch3"
        ></input>
        <label className="custom-control-label" htmlFor="customSwitch4">
          the rooms is not hidden
        </label>
      </div>

      <div
        style={!First ? { display: "none" } : { display: "block" }}
        className="custom-control custom-switch"
      >
        <input
          onChange={(e) => isStream(e)}
          type="checkbox"
          checked={IsStream}
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