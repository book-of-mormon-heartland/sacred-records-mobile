import { createContext, useState } from  "react";
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
var Environment = require('./environment.ts');

export const GoogleAuthContext = createContext("");

export const GoogleAuthProvider = ({ children }) => {

    const [message, setMessage] = useState("Not Signed In");
    const [userProfile, setUserProfile] = useState(undefined);
    const [userToken, setUserToken] = useState("");


    const signIn = async () => {
        console.log("signIn");
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            if(isSuccessResponse(response)){
                console.log("Google Sign-In Success: ", response.data );
                setMessage("Logged In Successfully");
                setUserProfile(response.data.user);
                setUserToken(response.data.idToken);

                // from here we make calls to server to authenticate to the rest server.

            } else {
                console.log("NOT Successful: ", response.data );
                setMessage( "Not Successful");
                setUserProfile(undefined);
                setUserToken(undefined);
            }
        } catch (error) {
            console.log("Error: ", error );

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                setMessage('User cancelled the login flow');
                setUserProfile(undefined);
                setUserToken(undefined);
            } else if (error.code === statusCodes.IN_PROGRESS) {
                setMessage('Sign in is in progress already');
                setUserProfile(undefined);
                setUserToken(undefined);
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                setMessage('Play services not available or outdated');
                setUserProfile(undefined);
                setUserToken(undefined);
            } else {
                setMessage(`Some other error happened: ${error.message}`);
                setUserProfile(undefined);
                setUserToken(undefined);
            }
        }
    };


    const signOut = async () => {
        console.log("signOut");
        try {
            await GoogleSignin.signOut();
            setMessage('Signed Out'); 
            setUserProfile(undefined);
            setUserToken("");

          // Perform additional cleanup and logout operations.
        } catch (error) {
            console.log('Google Sign-Out Error: ', error);
        }
    }



    return (
        <GoogleAuthContext.Provider value={{ signIn, signOut, message, setMessage, userToken, userProfile }}>
            { children }
        </GoogleAuthContext.Provider>
    );
    
}
