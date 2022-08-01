import React from "react";
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


