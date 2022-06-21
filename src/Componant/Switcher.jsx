import { useEffect } from "react";
import { useNavigate , useLocation } from "react-router-dom";

export default function Switcher() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
console.log('REDICATING THE PAGE TO WMEEET')
console.log(location?.state?.roomName)
console.log(location?.state?.IsPublic)
console.log(location?.state?.IsViewer)


setTimeout(() => {
  navigate( '/CallBorad/'+location?.state?.roomName
  ,
  {   state: {
       IsPublic: true,
       IsViewer:false
     }})
}, 5000); 

},[])


  

  return <><span>loadin</span></>
  
}