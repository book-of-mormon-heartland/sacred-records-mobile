/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeProvider } from "./context/ThemeContext";
import { GoogleAuthProvider } from "./context/GoogleAuthContext";
import { SafeAreaView } from 'react-native';
import LoginScreenComponent from './component/LoginScreenComponent'; // Adjust path as needed





function App() {
  const [theme, setTheme] = useState("light");

  return (
    <GoogleAuthProvider value={{  }}>
      <ThemeProvider value={{ theme, setTheme }}>
        <SafeAreaView style={styles.container} >
          <LoginScreenComponent />
        </SafeAreaView>
      </ThemeProvider>
    </GoogleAuthProvider>
  );
}


export default App;

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
});

