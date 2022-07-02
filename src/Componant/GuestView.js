
 const GuestView = ({Guest , size})=>{

    console.log(size)
    const {id,feed}=Guest;

    return   <video ref={feed} autoPlay className={`${!id && 'd-none'} Vd-box  ${size === 2 ? " w-100":" w-50"} `}></video>

}
export default  GuestView ;