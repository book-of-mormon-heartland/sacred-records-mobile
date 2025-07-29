import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext, ThemeProvider } from '.././context/ThemeContext';
import { GoogleAuthContext, GoogleAuthProvider } from '.././context/GoogleAuthContext';
import { GoogleSigninButton, GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';


const LoginScreenComponent = ( {navigation} ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { signIn, signOut, message, setMessage, userToken } = useContext(GoogleAuthContext);
  
  const showMessage= () => {
     Alert.alert(message);
  }

  return (
    <View>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={ signIn }
        disabled={false}
      />
      <Button
        onPress={ signOut }
        title="Sign Out"
        color="#841584"
      />
      <Text style={styles.themeText}>Login Message: {message}</Text>
      
      <Text style={styles.themeText}>Theme: {theme}</Text>
      
      <Text style={styles.themeText}>UserToken: {userToken }</Text>
      <Button
        onPress={ toggleTheme }
        title="Toggle Theme"
        color="#841584"
      />
      <Button
            title="Go to App"
            onPress={() =>
              navigation.navigate('Home', { })
            }
          />
    </View>
  );
};

const styles = StyleSheet.create({
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

export default LoginScreenComponent;