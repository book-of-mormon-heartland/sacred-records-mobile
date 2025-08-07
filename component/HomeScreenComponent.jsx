import React, { useContext } from 'react';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import LoginScreenComponent from './LoginScreenComponent.jsx';
import LibraryScreenComponent from './LibraryScreenComponent.jsx';


const HomeScreenComponent = ( {navigation} ) => {

  //const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { userToken } = useContext(GoogleAuthContext);

  if(userToken?.length>0) {
    return (
      <LibraryScreenComponent />
    );
  } else {
    return (
      <LoginScreenComponent />
    );
  }
};

export default HomeScreenComponent;