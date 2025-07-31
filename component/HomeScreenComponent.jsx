import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext, ThemeProvider } from '.././context/ThemeContext';
import { GoogleAuthContext, GoogleAuthProvider } from '.././context/GoogleAuthContext';
import { GoogleSigninButton, GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import LoginScreenComponent from './LoginScreenComponent.jsx';
import LibraryScreenComponent from './LibraryScreenComponent.jsx';


const HomeScreenComponent = ( {navigation} ) => {

  //const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { signIn, signOut, message, setMessage } = useContext(GoogleAuthContext);
  const { userToken, userProfile  } = useContext(GoogleAuthContext);

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

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 8,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 8,
    margin: 10,
    justifyContent: 'top',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
  },


});

export default HomeScreenComponent;