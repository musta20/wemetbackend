
import React, { Component } from 'react';

class Modal extends Component {

  render() {
    return (
      <div className={this.props.Id[2] ? "modal fade" : "modal fade show"}
        id="exampleModal" tabIndex="-1"
        role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden={this.props.Id[2] ? "true" : ""}
        style=
        {this.props.Id[2] ? { display: 'none' } :
          { display: 'block', paddingRight: '15px' }}>

        <div className="modal-dialog" role="document">
          <div className="rounded-0 modal-content">
            <div className="modal-header">
              <button onClick={() => this.props.ToogleBox(this.props.Id)}
                type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div

              className="modal-body">

              <h5 className=" text-info font-weight-bold"
                id="exampleModalLabel">Send a privet message</h5>
              <br></br>

              <div >

                <form className="form-inline h-80 justify-content-md-center ">
                  <input
                    onChange={this.props.onChange}
                    type="text" className="w-80 form-control"
                    value={this.props.PrivetMessage}
                    name="PrivetMessage" placeholder="Chat here">
                  </input>
                  <button
                    type="submit"
                    onClick={this.props.SendPrivetMessage}
                    id={this.props.Id[1]}
                    className=" btn sendc">
                  </button>
                  <div className="input-group-prepend"></div>
                </form>





              </div>
            </div>
            <div style=
              {!this.props.admin ? { display: 'none' } :
                { display: 'block' }} className="modal-footer ">
              <button onClick={() => this.props.KikHimOut(this.props.Id[1])} className="btn btn-danger">Drop user from this room</button>
            </div>
          </div>
        </div>
      </div>)

  }


}


export default Modal;
