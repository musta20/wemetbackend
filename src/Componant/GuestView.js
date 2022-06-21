
 const GuestView = ({Guest})=>{

    const {id,feed}=Guest;

    return   <video ref={feed} autoPlay className={`${!id && 'd-none'} Vd-box h-0 w-50 `}></video>

}
export default  GuestView ;