/* import { IconButton, Tooltip } from "@chakra-ui/react";
import { FcMenu } from "react-icons/fc"; */
const GuestView = ({ Guest }) => {

  if (Guest?.id === 0) return <></>;
  return <video
        ref={Guest?.feed}
        autoPlay
       // style={{ borderRadius: "5px", width: "100%" }}
      ></video>


};
export default GuestView;
      /* <Tooltip position={"absolute"} label="Chat">
        <IconButton
          float={"right"}
          aria-label="Chat"
          variant={"ghost"}
     
          role={"group"}
          colorScheme={"whiteAlpha"}
          icon={<FcMenu size={25} />}
        />
      </Tooltip>
    </> */