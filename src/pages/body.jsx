import React, {useContext, useEffect, useState  } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import BodyFooter from "../Componant/BodyFooter";
//import { useUserApi } from '../lib/hooks/userApi';
import { useNavigate } from 'react-router-dom';

import { SocketContext } from "../contextApi/Contexts/socket"


export default function Body (){

  const navigate = useNavigate();

    const [TheRoom,setTheRoom] = useState('');
    const [Rooms,setRooms] = useState([]);
   // const { Socket } = useUserApi();

    const Socket = useContext(SocketContext);

  


useEffect(()=>{

    //this event delete a room from the list 
    Socket.on('DelteRoom', ({ TheroomName }) => {
      console.log('DelteRoom')
      console.log(Rooms)
      if (Rooms.length === 0) return
      let Rooms = [...Rooms]
      Rooms = Rooms.filter(room => room !== TheroomName)
      setRooms( Rooms )

    })

    //this event add a room from the list 
    Socket.on('AddRoom',({ roomName }) => {
      console.log('AddRoom')
    
      console.log(Rooms)
      if (Rooms.length === 0) {
        let theRooms = [roomName]
        
        setRooms( theRooms )
        return
      }
      let theRooms = [...Rooms, roomName]
    
      setRooms( theRooms )
    })

    //request the currnt live room in the server
    Socket.emit('getroom', 'mainrrom',
      (data) => {
        console.log("THE DATA RETREVED FROM THE SERVER")
        console.log(data)
        setRooms( data )
      })

},[])




  //this function will devied the list of room in to group 
 const SplitRoomList = (list, howMany)=> {
    var idx = 0
    var result = []

    while (idx < list.length) {
      if (idx % howMany === 0) result.push([])
      result[result.length - 1].push(list[idx++])
    }

    return result
  }

  //this function will chek if 3 room in one list
 const If3RoomAvailable = (cnt, el) => {
    if (cnt === 2) {
      return el;
    }
  }

  //this function will take the user to call room as viewr
  const GoToCallRoomWatch = (e) =>{
    let roomName = e.target.id;

    navigate( '/CallBorad/'+roomName,
   {   state: {
        IsPublic: false,
        IsViewer: true
      }}
    )


  }

  //this function will take the user to room as memper
 const join = (e) =>{

    let roomName = e.target.id;

    navigate( '/CallBorad/'+roomName,
     { state: {
        IsPublic: false,
        IsViewer: false
      }}
    )


  }

  //this function display empty room message
 const  NoRoome =()=> {
    return <div> <div className="row  justify-content-md-center">
      <div
        className="col-xs-6 col-md-4 btn">
        <br></br>
        <br></br>
        <div className=''>
          <div className="   mainstreamicon"
          >
          </div>
          <div className="textstream" >
            It's seem like no one is streamming<br />
            how abut being the frist</div>
        </div>
      </div>

    </div>

    </div>

  }

  //this function will show the live room in the server
const  ShowRooms = ()=> {
    if (Rooms.length === 0)  return NoRoome();

    
    let roomgroup = SplitRoomList(Rooms, 3)
 
    if (roomgroup.length === 0) return NoRoome();


    return roomgroup.map((romg, i) =>
      <div key={i} className="row  justify-content-md-center">
        {romg.map((room, i) => <div key={i} className="col-xs-6 col-md-4 ">
          <div id={room} className=" mov mb-3  Vd-box "
            style={{ width: '280px', height: '200px', backgroundImage: "url(http://localhost:6800/imges/" + room + ".png)" }} >
            <span className=" badge badge-danger">LIVE</span>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div className=''>
              <button id={room} onClick={()=>GoToCallRoomWatch()} className="m-1 btn btn-sm  btn-primary">just watch</button>
              <button id={room} onClick={(e)=>join(e)} className="m-1 btn btn-sm btn-primary">join this room</button>
            </div>
          </div>
        </div>

        )}
      </div>)
  }


    return (
      <>
        <br></br>
        <br></br>
        <br></br>


        <div className="container  mt-3 justify-content-md-center ">



          {ShowRooms()}

          <br></br>
          <br></br>
          <br></br>

        </div>
        <BodyFooter></BodyFooter>
      </>
    );
  

}



