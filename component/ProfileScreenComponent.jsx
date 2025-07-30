import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';


const ProfileScreenComponent = ( {navigation} ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { signIn, signOut, message, setMessage, userToken } = useContext(GoogleAuthContext);
  
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Profile</Text>
      <Button title="Sign Out of Sacred Records" onPress={signOut} />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },

});

export default ProfileScreenComponent;