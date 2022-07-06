import React from "react";
import Footer from "../Footer";
import { Container } from '@chakra-ui/react'


const Layout = ({ children }) => {

  return (
    <><Container maxW='container.lx'>

{ children }

    </Container>
 
    </>
  );
};

export default Layout;


