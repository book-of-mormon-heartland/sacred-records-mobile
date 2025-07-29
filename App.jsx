/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useContext, useState } from 'react';
import { StyleSheet, Button } from 'react-native';
import { ThemeProvider } from "./context/ThemeContext";
import { GoogleAuthContext, GoogleAuthProvider } from "./context/GoogleAuthContext";
import { SafeAreaView } from 'react-native';
import LoginScreenComponent from './component/LoginScreenComponent'; // Adjust path as needed
import HomeScreenComponent from './component/HomeScreenComponent'; // Adjust path as needed
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();


function App() {
  const [theme, setTheme] = useState("light");
  const { userToken, userProfile  } = useContext(GoogleAuthContext);
  


  const RootStack = () => {
    return (
          <Stack.Navigator >
            <Stack.Screen options={{
              headerShown: false,
            }} name="Login" component={LoginScreenComponent} />
            <Stack.Screen name="Home" component={HomeScreenComponent} />
          </Stack.Navigator>
    );
  };


  return (
    <GoogleAuthProvider value={{  }}>
      <ThemeProvider value={{ theme, setTheme }}>
        <NavigationContainer>
          <RootStack /> 
        </NavigationContainer>
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

const HomeScreen = ({navigation}) => {
  return (
    <Button
      title="Go to Jane's profile"
      onPress={() =>
        navigation.navigate('Profile', {name: 'Jane'})
      }
    />
  );
};

const ProfileScreen = ({navigation, route}) => {
  return <Text>This is {route.params.name}'s profile</Text>;
};

/*
    <NavigationContainer>
      <GoogleAuthProvider value={{  }}>
        <ThemeProvider value={{ theme, setTheme }}>
          <SafeAreaView style={styles.container} >
            <Stack.Navigator>
              <Stack.Screen
                name="Login"
                component={HomeScreen}
              />
            </Stack.Navigator>
          </SafeAreaView>
        </ThemeProvider>
      </GoogleAuthProvider>
    </NavigationContainer>  

*/