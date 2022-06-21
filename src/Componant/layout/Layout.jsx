import React from "react";
import Footer from "../Footer";


const Layout = ({ children }) => {

  return (
    <>
    <div className="container-fluid	">
        <div className="row ">
          <br></br>
          <br></br>
        </div>
        <br></br>
        { children }

      </div>
      <Footer></Footer>
    </>
  );
};

export default Layout;