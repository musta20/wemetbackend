import React, { Component } from 'react';

import { Link } from 'react-router-dom';

class Footer extends Component {
    state = {  }

    render() { 
        return ( <footer className="container-fluid m-0  bg-light  fixed-bottom ">
          <div >
          <div className="Logo m-1" href="#"></div>

            <small className="d-block mb-3 text-muted">© wemet.live 2017-2018</small>
            <div className=" text-center">
            <span><Link className="text-muted" to={"/Terms"}>Terms of Service</Link></span>&nbsp; &nbsp; 
            <span><Link className="text-muted" to={"/Privacy"}>Privacy Policy</Link></span>&nbsp; &nbsp;
            <span><Link className="text-muted" to={"/Guidelines"}>Community Guidelines</Link></span>

            
          </div>
          </div>
        
       
      </footer>
       );
    }
}
 
export default Footer;