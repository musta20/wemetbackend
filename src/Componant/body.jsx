import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import 'react-toastify/dist/ReactToastify.css';
import BodyFooter from "./BodyFooter";


export default function Body (){

  
    const [TheRoom,setTheRoom] = useState('');
    const [socket,setSocket] = useState(io('http://localhost:6800'));
    const [Rooms,setRooms] = useState([]);



  

  //this function initae a server connection and set event lisner
 const connectAndGetRooms = async () => {
    await setSocket(io('http://localhost:6800') )

    //this event delete a room from the list 
    socket.on('DelteRoom', ({ TheroomName }) => {
      console.log('DelteRoom')
      console.log(Rooms)
      if (Rooms.length === 0) return
      let Rooms = [...Rooms]
      Rooms = Rooms.filter(room => room !== TheroomName)
      setRooms( Rooms )

    })

    //this event add a room from the list 
    socket.on('AddRoom', ({ roomName }) => {
      console.log('AddRoom')

      console.log(Rooms)
      if (Rooms.length === 0) {
        let Rooms = [roomName]
        
        setRooms( Rooms )
        return
      }
      let Rooms = [...Rooms, roomName]

      setRooms( Rooms )
    })

    //request the currnt live room in the server
    socket.emit('getroom', 'mainrrom',
      (data) => {
        setRooms( data )
      })


  }

  useEffect(()=>{
    connectAndGetRooms()

    return ()=>{

    try {
      socket.disconnect()

    } catch (e) {
      console.error(e)
    }
    }

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

    this.props.history.push({
      pathname: '/CallBorad/'+roomName,
      state: {
        IsPublic: false,
        IsViewer: true
      }
    })


  }

  //this function will take the user to room as memper
 const join = (e) =>{
    let roomName = e.target.id;

    this.props.history.push({
      pathname: '/CallBorad/'+roomName,
      state: {
        IsPublic: false,
        IsViewer: false
      }
    })


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
              <button id={room} onClick={this.GoToCallRoomWatch} className="m-1 btn btn-sm  btn-primary">just watch</button>
              <button id={room} onClick={this.join} className="m-1 btn btn-sm btn-primary">join this room</button>
            </div>
          </div>
        </div>

        )}
      </div>)
  }


    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  

}



