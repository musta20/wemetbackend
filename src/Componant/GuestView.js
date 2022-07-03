
 const GuestView = ({Guest , size})=>{

    console.log(size)
    const {id,feed}=Guest;
console.log(Guest)
    return   <video 
    style={{borderRadius:"5px",borderColor:"#f1f1f1"}}

    ref={feed} autoPlay
   ></video>

}
export default  GuestView 
//, width :`${size === 2 ? " 100%":" 50%"}`