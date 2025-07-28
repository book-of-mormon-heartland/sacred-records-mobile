import { createContext, useState } from  "react";
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
var Environment = require('./environment.ts');

export const GoogleAuthContext = createContext("");

export const GoogleAuthProvider = ({ children }) => {


    const [message, setMessage] = useState("My message");


    const signIn = async () => {
        console.log("signIn");
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            if(isSuccessResponse(response)){
                console.log("Google Sign-In Success: ", response.data );
                setMessage( response.data );
            } else {
                console.log("NOT Successful: ", response.data );
                setMessage( response.data );
            }
        } catch (error) {
            console.log("Error: ", error );

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                setMessage('User cancelled the login flow');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                setMessage('Sign in is in progress already');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                setMessage('Play services not available or outdated');
            } else {
                setMessage(`Some other error happened: ${error.message}`);
            }
        }
    };


    const signOut = async () => {
        console.log("signOut");
        
        try {
		  await GoogleSignin.signOut();
		  // Perform additional cleanup and logout operations.
        } catch (error) {
            console.log('Google Sign-Out Error: ', error);
        }
        
    }

    return (
        <GoogleAuthContext.Provider value={{ signIn, signOut, message, setMessage }}>
            { children }
        </GoogleAuthContext.Provider>
    );
    
}
