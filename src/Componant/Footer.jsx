import React, { Component } from 'react';
class Footer extends Component {
    state = {  }
    render() { 
        return ( <footer className="fixed-bottom bg-light">
        <div className="container">
          <p className="m-0 text-center text-white">Copyright © wemet 2020</p>
        </div>
      </footer>
       );
    }
}
 
export default Footer;