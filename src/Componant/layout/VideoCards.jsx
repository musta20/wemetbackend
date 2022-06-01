const VideoCards = ({
  GetElemntCssClass,
  First,
  SendMessageChat,
  ChatMessage,
  guest,
  ToggleElementCssClass,
  HistoryChat,
  setChatMessage,
  IsVedioElemntVisble,
  ToogleBox,
}) => {
  return (
    <div className="  row no-gutters   justify-content-md-center h-100 ">
      <div className={GetElemntCssClass(0) + ` chatback`}>
        <form className="form-inline h-80 justify-content-md-center ">
          <div className="h-100 w-80 overflow-auto">
            <div className="mhchat">{HistoryChat}</div>
          </div>
          <input
            onChange={(e) => setChatMessage(e.target.value)}
            type="text"
            className="w-80 form-control"
            value={ChatMessage}
            name="ChatMessage"
            placeholder="Chat here"
          ></input>

          <button
            type="submit"
            onClick={SendMessageChat}
            className=" btn sendc"
          ></button>
          <div className="input-group-prepend"></div>
        </form>
      </div>

      <div className={GetElemntCssClass(1)}>
        <div
          className={`${
            IsVedioElemntVisble(guest[1][1]) ? "visible" : "d-none"
          }  `}
        >
          <video
            ref={guest[1][0]}
            className="Vd-box h-0 w-100"
            autoPlay
          ></video>
          <span
            onClick={() => ToogleBox(guest[1])}
            className=" video-controls btn"
          ></span>
        </div>

        <div
          className={`${
            IsVedioElemntVisble(guest[2][1]) ? "visible" : "d-none"
          }  `}
        >
          <video
            ref={guest[2][0]}
            className="Vd-box h-0 w-100"
            autoPlay
          ></video>

          <span
            onClick={() => ToogleBox(guest[2])}
            className="  video-controls btn"
          ></span>
        </div>
      </div>

      <div className={GetElemntCssClass(2) + ` `}>
        <video ref={guest[0][0]} autoPlay className="Vd-box h-0 w-100 "></video>
        <span
          onClick={() => ToogleBox(guest[0])}
          className={`${!First ? "visible" : "d-none"}  video-controls btn `}
        ></span>
      </div>

      <div className={GetElemntCssClass(3)}>
        <div
          className={`${
            IsVedioElemntVisble(guest[3][1]) ? "visible" : "d-none"
          }  `}
        >
          <video
            ref={guest[3][0]}
            className="Vd-box h-0 w-100"
            autoPlay
          ></video>

          <span
            onClick={() => ToogleBox(guest[3])}
            className="  video-controls btn"
          ></span>
        </div>

        <div
          className={`${
            IsVedioElemntVisble(guest[4][1]) ? "visible" : "d-none"
          }  `}
        >
          <video
            ref={guest[4][0]}
            className="Vd-box h-0 w-100"
            autoPlay
          ></video>

          <span
            onClick={() => ToogleBox(guest[4])}
            className="  video-controls btn"
          ></span>
        </div>
      </div>
      <div className="SideBarChat">
        <button
          type="submit"
          onClick={() => ToggleElementCssClass(0)}
          className={`${
            GetElemntCssClass(0) === "d-none" ? "OpenChat" : "CloseChat"
          } btn`}
        ></button>
      </div>
    </div>
  );
};

export default VideoCards;
