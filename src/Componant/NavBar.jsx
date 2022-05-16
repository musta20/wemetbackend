import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Ajv from 'ajv';
//import { useUserApi } from '../lib/hooks/userApi';
import {SocketContext} from "../context/socket"

export default function Navbar() {


  const Socket = useContext(SocketContext);

  const [ajv, setAjv] = useState(new Ajv())

  const [Warning, setWarning] = useState([null, ""])
  const [RoomName, setRoomName] = useState([null, ""])
  const [Rooms, setRooms] = useState(null)
  const [TheRoom, setTheRoom] = useState("")
  const [toggleNav, settoggleNav] = useState(true)
  const [isBoxToggleOn, setisBoxToggleOn] = useState(true)
  const [IsPublic, setIsPublic] = useState(true)
  const [IsRommeExist, setIsRommeExist] = useState(true)
  const navigate = useNavigate();

  //const {Socket} = useUserApi();

  const ENDPOINT = `http://localhost:6800`;

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
    navigate({
        pathname: '/Switch',
        state: { CallBorad: false }
     })


  }

  //this function will take the user to the stramin room
  const GoStream = () => {
    navigate('/CallBorad/'+TheRoom,
    {state:{
      IsPublic:  IsPublic,
      IsViewer: false
   
    }})
      



  }

  //check api valible room name
  const isRoomeValid = (value) => {
    //  console.log(socket)


    Socket.emit('IsRommeExist', '{"title":"' + value + '"}',
      (data) => {

        if (data.status) {
          setRoomName("form-control border border-success");
          setWarning(["form-text text-success", "the room name is valed"])
          return
        }

        setRoomName("form-control border border-danger");
        setWarning(["form-text text-danger", "the name is not valed " + data.room])




      })

  }
  //this function will store the value of the input in the state and vladate it
  const onchange = (e) => {
    setTheRoom(e.target.value)

    if ((e.target.value).length < 3) return;

    var valid = ajv.validate(schema, { name: e.target.value });
    if (!valid) {

      setRoomName("form-control border border-danger")
      if (ajv.errors[0].message === 'must match pattern "^[a-zA-Z0-9]{4,10}$"') {
        setWarning(["form-text text-danger", "the name is not valid special character is not allowed"])

      } else {
        setWarning(["form-text text-danger", "the name is not valed " + ajv.errors[0].message]);
      }

      return
    }
    // console.log('emmiyedd')

    isRoomeValid(e.target.value);
  }

  //this function will empty the filed 
  //and close the dilog and take the use to the stram
  const StartCreatingTheRoom = (e) => {
    setRoomName("form-control border")

    setTheRoom("")
    GoStream()
    // ToogleRoomNameBox()

  }

  //this function get called the to save the value of the check box to the state
  const UpdateCheckBox = (e) => {
    setIsPublic(e.target.checked)
    console.log(IsPublic)
  }

  //this function will toggle the nav dilog

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


    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">

            <h5 className="modal-title  text-info font-weight-bold" id="exampleModalLabel">Create a chat room</h5>

            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

          </div>
          <div className="modal-body">
            <input
              onChange={e => onchange(e)} type="text"
              value={TheRoom}

              className={`form-control border ${RoomName}`}
              name="" placeholder="Room name" id="" />
            <div >
              <small className={`form-text ${Warning[0] ? Warning[0] : ''} `} >{Warning[1]}</small>

            </div>
          </div>
          <div className="modal-footer d-flex">

            <div className="custom-control custom-switch">
              <input
                onChange={e => UpdateCheckBox(e)}
                checked={IsPublic}
                type="checkbox"
                className="custom-control-input "
                id="customSwitch1">
              </input>
              <label className="custom-control-label" htmlFor="customSwitch1">Public room (Visible for everyone)</label>
            </div>
            <div className=" gradient  border rounded">
              <button 
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              onClick={() => StartCreatingTheRoom()} className="btn text-white font-weight-bold">Stream</button>

            </div>
          </div>
        </div>
      </div>
    </div>


  </>);

}

