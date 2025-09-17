import { createContext, useState } from  "react";
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
var Environment = require('./environment.ts');
import { Platform } from 'react-native';
import { useI18n } from '.././context/I18nContext'; 


export const GoogleAuthContext = createContext("");

export const GoogleAuthProvider = ({ children }) => {

    const [googleMessage, setGoogleMessage] = useState("Not Signed In");
    const [userProfile, setUserProfile] = useState(undefined);
    const [userToken, setUserToken] = useState("");
    const [jwtToken, setJwtToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const { language, setLanguage, translate } = useI18n();
    const isIOS = ( Platform.OS === 'ios' );
    let serverUrl = Environment.NODE_SERVER_URL;
    if(isIOS) {
        serverUrl = Environment.IOS_NODE_SERVER_URL;
    }

    const refreshJwtToken = async() => {
       console.log("This is the stub for refreshJwtToken");
       return {
          message: "working" 
       }
    }

    const signIn = async () => {
        console.log("signIn");
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            if(isSuccessResponse(response)){
                console.log("Google Sign-In Success: ", response.data );
                let user = response.data.user;
                let idToken = response.data.idToken;

                // from here we make calls to server to authenticate to the rest server.
                try {
                    const postResponse = await fetch(serverUrl + "/rest/POST/googlelogin", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token: idToken, user: user }),
                    });
                    if (!postResponse.ok) {
                        throw new Error(`HTTP error! status: ${postResponse.status}`);
                    }
                    const responseData = await postResponse.json();
                    const obj = JSON.parse(responseData);

                    if(obj?.language && (obj.language != "")) {
                        console.log("Language from server: " + obj.language);
                        setLanguage(obj.language);
                    }

                    if(obj?.jwtToken) {
                        setJwtToken(obj.jwtToken || "");
                        setRefreshToken(obj.refreshToken || "");
                        setGoogleMessage("Logged In Successfully");
                        setUserProfile(user);
                        setUserToken(idToken);
                    } else {
                        console.log("No JWT Token returned from server.");
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            } else {
                console.log("NOT Successful: ", response.data );
                setGoogleMessage( "Not Successful");
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");
            }
        } catch (error) {
            console.log("Error: ", error );

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                setGoogleMessage('User cancelled the login flow');
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");

            } else if (error.code === statusCodes.IN_PROGRESS) {
                setGoogleMessage('Sign in is in progress already');
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                setGoogleMessage('Play services not available or outdated');
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");
            } else {
                setGoogleMessage(`Some other error happened: ${error.message}`);
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");
            }
        }
    };


  const signOut = async () => {
        console.log("signOut");
        const userid = userProfile?.id  || "0";
        try {
            const signoutResponse = await GoogleSignin.signOut();
            console.log("signoutResponse: " + signoutResponse);
            setGoogleMessage('Not Signed In'); 
            setUserProfile(undefined);
            setUserToken("");
            setJwtToken("");
            setRefreshToken("");
            // need to do GoogleSignin.disconnect also.
        } catch (error) {
            console.log('Google Sign-Out Error: ', error);
        }
    }

    return (
        <GoogleAuthContext.Provider value={{ signIn, signOut, googleMessage, setGoogleMessage, userToken, userProfile, jwtToken, refreshToken }}>
            { children }
        </GoogleAuthContext.Provider>
    );
    
}
