import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import { Platform } from 'react-native';


const LibraryScreenComponent = ( {navigation} ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { signIn, signOut, message, setMessage, userToken, fakeSignOut } = useContext(GoogleAuthContext);
  const isIOS = ( Platform.OS === 'ios' );

  return (
    <View style={styles.container}>
      <Text>Library Coming Soon</Text> 
        <Text style={styles.text}>Login Message: {message}</Text>      
        <Text style={styles.text}>Theme: {theme}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default LibraryScreenComponent;