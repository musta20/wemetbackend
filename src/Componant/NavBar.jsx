import React, { useState, useRef } from 'react';
import io from "socket.io-client";
import Ajv from 'ajv';


export default function Navbar() {



  const myRef = useRef(null);
  const RoomName = useRef(null);
  const CallBorad = useRef(null);
  const Warning = useRef(null);

  const [ajv, setAjv] = useState(new Ajv())

  const [socket, setsocket] = useState(io('http://localhost:6800'))
  const [Rooms, setRooms] = useState(null)
  const [TheRoom, setTheRoom] = useState("")
  const [toggleNav, settoggleNav] = useState(true)
  const [isBoxToggleOn, setisBoxToggleOn] = useState(true)
  const [IsPublic, setIsPublic] = useState(true)
  const [IsRommeExist, setIsRommeExist] = useState(true)

  const [schema, setschema] = useState({
    "properties":
    {
      "name": {
        "type": "string",
        "minLength": 5,
        "maxLength": 8,
        "pattern": "^[a-zA-Z0-9]{4,10}$"
      }
    }
  }
  )




  //this function will take the user to the main bage
  const GoHome = () => {
    //  props.history.push({
    //    pathname: '/Switch',

    //    state: { CallBorad: false }
    // })
  }

  //this function will take the user to the stramin room
  const GoStream = () => {
    //   props.history.push({
    //     pathname: '/Switch',

    //    state: {
    //      CallBorad: true, TheRoom: TheRoom, IsPublic: IsPublic,
    //      IsViewer: false
    //    }
    //  })
  }

  //this function will store the value of the input in the state and vladate it
  const onchange = (e) => {
    TheRoom(e.target.value)
    if ((e.target.value).length < 3) return;

    var valid = ajv.validate(schema, { name: e.target.value });
    if (!valid) {

      RoomName.current.className = "form-control border border-danger";
      if (ajv.errors[0].message === 'should match pattern "^[a-zA-Z0-9]{4,10}$"') {
        Warning.current.innerHTML = "the name is not valid special character is not allowed"

      } else {
        Warning.current.innerHTML = "the name is not valed " + ajv.errors[0].message

      }
      Warning.current.className = "form-text text-danger"
      return
    }

    socket.emit('IsRommeExist', '{"title":"' + e.target.value + '"}',
      (data) => {

        if (data.status) {
          RoomName.current.className = "form-control border border-success";
          setIsRommeExist(true)
          Warning.current.innerHTML = "the room name is valed"
          Warning.current.className = "form-text text-success"

        } else {

          RoomName.current.className = "form-control border border-danger";
          setIsRommeExist(false)
          Warning.current.innerHTML = "the name is not valed " + data.room
          Warning.current.className = "form-text text-danger"

        }

      })
  }

  //this function will empty the filed 
  //and close the dilog and take the use to the stram
  const StartCreatingTheRoom = (e) => {
    RoomName.current.className = "form-control border";
    Warning.current.innerHTML = ""
    setTheRoom("")
    GoStream()
    ToogleRoomNameBox()

  }

  //this function get called the to save the value of the check box to the state
  const UpdateCheckBox = (e) => {
    setIsPublic(e.target.checked)
    console.log(IsPublic)
  }

  //this function will toggle the nav dilog
  const ToogleRoomNameBox = (e) => {
    if (isBoxToggleOn) {
      setisBoxToggleOn(false)
    } else {
      setisBoxToggleOn(true)
    }

  }

  //this function will toggle the nav bar on small view
  const CollapsaNav = (e) => {
    if (toggleNav) {
      settoggleNav(false)
    } else {
      settoggleNav(true)
    }
  }



  return (<>
    <nav className="navbar navbar-expand-lg navbar-dark BK-header fixed-top">
      <div className={isBoxToggleOn ? "" : "blockback"}></div>
      <div className="container">
        <div className='d-flex' >
          <div className="Logo" href="#"></div>
          <div className="navbar-brand ">Wemet</div>

        </div>

        <div className='d-flex' >
          <button className={toggleNav ? "navbar-toggler" : "navbar-toggler collapsed"}
            onClick={CollapsaNav}
            type="button" data-toggle="collapse"
            data-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded={toggleNav ? "false" : "true"}
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={toggleNav ? "collapse navbar-collapse" : "collapse navbar-collapse show"}

            id="navbarResponsive">
            <ul className="navbar-nav ml-auto ">

              <li className="nav-item  m-1">
                <abbr title="Home">

                  <div onClick={GoHome}>
                    <div className=" btn home"></div>
                  </div>
                </abbr>
              </li>

              <li className="nav-item  m-1">

                <abbr title="Stream now">
                  <div
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  // onClick={ToogleRoomNameBox}
                  >
                    <div className="btn stream "></div>
                  </div>
                </abbr>

              </li>
            </ul>
          </div>
        </div>
      </div>







    </nav>
   

   <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
   <div class="modal-dialog">
     <div class="modal-content">
       <div class="modal-header">

         <h5 className="modal-title  text-info font-weight-bold" id="exampleModalLabel">Create a chat room</h5>
        
         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

       </div>
       <div class="modal-body">
         <input
           ref={RoomName}
           onChange={onchange} type="text"
           value={TheRoom}

           className="form-control border"
           name="" placeholder="Room name" id="" />
         <div >
           <small ref={Warning} className="form-text "></small>

         </div>
       </div>
       <div class="modal-footer">

         <div className="custom-control custom-switch">
           <input
             onChange={UpdateCheckBox}
             checked={IsPublic}
             type="checkbox"
             className="custom-control-input"
             id="customSwitch1">
           </input>
           <label className="custom-control-label" htmlFor="customSwitch1">Public room (Visible for everyone)</label>
         </div>
         <div className=" gradient  border rounded">
           <button onClick={StartCreatingTheRoom} className="btn text-white font-weight-bold">Stream</button>

         </div>
       </div>
     </div>
   </div>
 </div>


   </>);

}

