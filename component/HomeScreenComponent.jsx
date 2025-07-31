import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext, ThemeProvider } from '.././context/ThemeContext';
import { GoogleAuthContext, GoogleAuthProvider } from '.././context/GoogleAuthContext';
import { GoogleSigninButton, GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import LoginScreenComponent from './LoginScreenComponent.jsx';


const HomeScreenComponent = ( {navigation} ) => {

    //const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
    const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
    const { signIn, signOut, message, setMessage } = useContext(GoogleAuthContext);
    const { userToken, userProfile  } = useContext(GoogleAuthContext);
    
    if(userToken?.length>0) {
       return (
            <View style={styles.container}>
                <Text style={styles.themeText}>Login Message: {message}</Text>      
                <Text style={styles.themeText}>Theme: {theme}</Text>
            </View>
        );
    } else {
        return (
           <LoginScreenComponent />
        );
    }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 8,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  themeText: {
    fontSize: 14,
    color: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreenComponent;