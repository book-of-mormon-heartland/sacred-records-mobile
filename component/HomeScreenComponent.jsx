import React, { useContext } from 'react';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import LoginScreenComponent from './LoginScreenComponent.jsx';
import QuetzalBooksScreenComponent from './QuetzalBooksScreenComponent.jsx';


const HomeScreenComponent = ( {navigation} ) => {

  const { jwtToken } = useContext(GoogleAuthContext);

  if(jwtToken?.length>0) {
    return (
      <QuetzalBooksScreenComponent />
    );
  } else {
    return (
      <LoginScreenComponent />
    );
  }
};

export default HomeScreenComponent;