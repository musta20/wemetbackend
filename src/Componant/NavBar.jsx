import React, { Component, useState } from 'react';
import io from "socket.io-client";
import Ajv from 'ajv';


export default function Navbar () {



  const myRef = useRef(null);
  const RoomName = useRef(null);
  const CallBorad = useRef(null);
  const Warning = useRef(null);

  const [ajv , setAjv] = useState(Ajv())

  const [socket , setsocket] = useState(io('http://localhost:6800'))
  const [Rooms , setRooms] = useState(null)
  const [TheRoom , setTheRoom] = useState(null)
  const [toggleNav , settoggleNav] = useState(true)
  const [isBoxToggleOn , setisBoxToggleOn] = useState(true)
  const [IsPublic , setIsPublic] = useState(true)
  const [IsRommeExist , setIsRommeExist] = useState(true)

  const [schema , setschema] = useState( {
    "properties":
    {
      "name": {
        "type": "string",
        "minLength": 5,
        "maxLength": 8,
        "pattern": "^[a-zA-Z0-9]{4,10}$"
      }
    }}
  )


  }

  //this function will take the user to the main bage
  GoHome() {
    this.props.history.push({
      pathname: '/Switch',

      state: { CallBorad: false }
    })
  }

  //this function will take the user to the stramin room
const  GoStream = ()> {
 //   this.props.history.push({
 //     pathname: '/Switch',

  //    state: {
  //      CallBorad: true, TheRoom: this.state.TheRoom, IsPublic: this.state.IsPublic,
  //      IsViewer: false
  //    }
  //  })
  }

  //this function will store the value of the input in the state and vladate it
  const onchange = (e) => {
    this.setState({ TheRoom: e.target.value })
    if ((e.target.value).length < 3) return;

    var valid = this.state.ajv.validate(this.state.schema, { name: e.target.value });
    if (!valid) {

      this.RoomName.current.className = "form-control border border-danger";
      if (this.state.ajv.errors[0].message === 'should match pattern "^[a-zA-Z0-9]{4,10}$"') {
        this.Warning.current.innerHTML = "the name is not valid special character is not allowed"

      } else {
        this.Warning.current.innerHTML = "the name is not valed " + this.state.ajv.errors[0].message

      }
      this.Warning.current.className = "form-text text-danger"
      return
    }

    this.state.socket.emit('IsRommeExist', '{"title":"' + e.target.value + '"}',
      (data) => {

        if (data.status) {
          this.RoomName.current.className = "form-control border border-success";
          this.setState({ IsRommeExist: true })
          this.Warning.current.innerHTML = "the room name is valed"
          this.Warning.current.className = "form-text text-success"

        } else {

          this.RoomName.current.className = "form-control border border-danger";
          this.setState({ IsRommeExist: false })
          this.Warning.current.innerHTML = "the name is not valed " + data.room
          this.Warning.current.className = "form-text text-danger"

        }

      })
  }

  //this function will empty the filed 
  //and close the dilog and take the use to the stram
  StartCreatingTheRoom(e) {
    this.RoomName.current.className = "form-control border";
    this.Warning.current.innerHTML = ""
    this.setState({ TheRoom: "" })
    this.GoStream()
    this.ToogleRoomNameBox()

  }

  //this function get called the to save the value of the check box to the state
  UpdateCheckBox(e) {
    this.setState({ IsPublic: e.target.checked })
    console.log(this.state.IsPublic)
  }

  //this function will toggle the nav dilog
  ToogleRoomNameBox(e) {
    if (this.state.isBoxToggleOn) {
      this.setState({ isBoxToggleOn: false })
    } else {
      this.setState({ isBoxToggleOn: true })
    }

  }

  //this function will toggle the nav bar on small view
  CollapsaNav(e) {
    if (this.state.toggleNav) {
      this.setState({ toggleNav: false })
    } else {
      this.setState({ toggleNav: true })


    }
  }


  render() {

    return (

      <nav className="navbar navbar-expand-lg navbar-dark BK-header fixed-top">
        <div className={this.state.isBoxToggleOn ? "" : "blockback"}></div>
        <div className="container">

          <div className="Logo" href="#"></div>
          <div className="navbar-brand ">Wemet</div>

          <button className={this.state.toggleNav ? "navbar-toggler" : "navbar-toggler collapsed"}
            onClick={this.CollapsaNav}
            type="button" data-toggle="collapse"
            data-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded={this.state.toggleNav ? "false" : "true"}
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={this.state.toggleNav ? "collapse navbar-collapse" : "collapse navbar-collapse show"}

            id="navbarResponsive">
            <ul className="navbar-nav ml-auto ">

              <li className="nav-item  m-1">
                <abbr title="Home">

                  <div onClick={this.GoHome}>
                    <div className=" btn home"></div>
                  </div>
                </abbr>
              </li>

              <li className="nav-item  m-1">

                <abbr title="Stream now">
                  <div
                    onClick={this.ToogleRoomNameBox}
                  >
                    <div className="btn stream "></div>
                  </div>
                </abbr>

              </li>
            </ul>
          </div>
        </div>

        <div className={this.state.isBoxToggleOn ? "modal fade" : "modal fade show"}
          id="exampleModal" tabIndex="-1"
          role="dialog" aria-labelledby="exampleModalLabel"
          aria-hidden={this.state.isBoxToggleOn ? "true" : ""}
          style=
          {this.state.isBoxToggleOn ? { display: 'none' } :
            { display: 'block', paddingRight: '15px' }}
        >
          <div className="modal-dialog" role="document">
            <div className="rounded-0 modal-content">
              <div className="modal-header">
                <h5 className="modal-title  text-info font-weight-bold" id="exampleModalLabel">Create a chat room</h5>
                <button onClick={this.ToogleRoomNameBox} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <input
                  ref={this.RoomName}
                  onChange={this.onchange} type="text"
                  value={this.state.TheRoom}

                  className="form-control border"
                  name="" placeholder="Room name" id="" />
                <div >
                  <small ref={this.Warning} className="form-text "></small>

                </div>
              </div>
              <div className="modal-footer">

                <div className="custom-control custom-switch">
                  <input
                    onChange={this.UpdateCheckBox}
                    checked={this.state.IsPublic}
                    type="checkbox"
                    className="custom-control-input"
                    id="customSwitch1">
                  </input>
                  <label className="custom-control-label" htmlFor="customSwitch1">Public room (Visible for everyone)</label>
                </div>
                <div className=" gradient  border rounded">
                  <button onClick={this.StartCreatingTheRoom} className="btn text-white font-weight-bold">Stream</button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>);
  }
}

