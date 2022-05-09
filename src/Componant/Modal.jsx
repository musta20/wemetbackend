
import {React} from 'react';

function Modal ({admin , Id , KikHimOut ,PrivetMessage , SendPrivetMessage , setPrivetMessage , ToogleBox}) {


    return (
      <div className={Id[2] ? "modal fade" : "modal fade show"}
        id="exampleModal" tabIndex="-1"
        role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden={Id[2] ? "true" : ""}
        style=
        {Id[2] ? { display: 'none' } :
          { display: 'block', paddingRight: '15px' }}>

        <div className="modal-dialog" role="document">
          <div className="rounded-0 modal-content">
            <div className="modal-header">
              <button onClick={() => ToogleBox(Id)}
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
                    onChange={e=>setPrivetMessage(e.target.value)}
                    type="text" className="w-80 form-control"
                    value={PrivetMessage}
                    name="PrivetMessage" placeholder="Chat here">
                  </input>
                  <button
                    type="submit"
                    onClick={SendPrivetMessage}
                    id={Id[1]}
                    className=" btn sendc">
                  </button>
                  <div className="input-group-prepend"></div>
                </form>





              </div>
            </div>
            <div style=
              {!admin ? { display: 'none' } :
                { display: 'block' }} className="modal-footer ">
              <button onClick={() => KikHimOut(Id[1])} className="btn btn-danger">Drop user from this room</button>
            </div>
          </div>
        </div>
      </div>)

  


}


export default Modal;
