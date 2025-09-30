import { createContext, useState } from  "react";
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
var Environment = require('./environment.ts');
import { Platform } from 'react-native';
import { useI18n } from '.././context/I18nContext';
import * as Keychain from 'react-native-keychain'; 


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

    const saveJwtToken = async(token) => {
        try {
            // You can use a static string like 'jwtToken' for the username
            // or a user-specific identifier if needed.
            await Keychain.setGenericPassword('jwtToken', token);
            console.log('JWT token saved successfully!');
        } catch (error) {
            console.error('Error saving JWT token:', error);
        }
    }

    const retrieveJwtToken = async() => {
        try {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                //console.log('JWT token retrieved successfully:', credentials.password);
                
                return credentials.password; // This is your JWT token
            } else {
            console.log('No JWT token found.');
            return null;
            }
        } catch (error) {
            console.error('Error retrieving JWT token:', error);
            return null;
        }
    }

    const deleteJwtToken = async() => {
        try {
            await Keychain.resetGenericPassword();
            console.log('JWT token deleted successfully!');
        } catch (error) {
            console.error('Error deleting JWT token:', error);
        }
    }

    const refreshJwtToken = async () => {
        try {
            const postResponse = await fetch(serverUrl + "/authentication/refreshJwtToken", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({ 
                    jwtToken: jwtToken, 
                    refreshToken: refreshToken,
                    userId: userProfile.id
                }),
            });
            if (!postResponse.ok) {
                console.log("It was an error");
                throw new Error(`HTTP error! status: ${postResponse.status}`);
            }
            const responseData = await postResponse.json();
            const obj = JSON.parse(responseData);
            console.log(obj);
            
            if(obj.message==="update-jwt-token") {
              console.log("This is the new jwtToken: " +  obj.jwtToken);
              setJwtToken(obj.jwtToken);
              return obj;
            }
        } catch (error) {
            console.error('Error:', error);
            return JSON.stringify({
                message: "failure to update",
                jwtToken: ""
            });
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
                    console.log(serverUrl + "/authentication/googleLogin");

                    const postResponse = await fetch(serverUrl + "/authentication/googleLogin", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token: idToken, user: user }),
                    });
                    if (!postResponse.ok) {
                        console.log("Response not ok");
                        throw new Error(`HTTP error! status: ${postResponse.status}`);
                    }
                    const responseData = await postResponse.json();
                    const obj = JSON.parse(responseData);

                    if(obj?.language && (obj.language != "")) {
                        console.log("Language from server: " + obj.language);
                        setLanguage(obj.language);
                    }

                    if(obj?.jwtToken) {
                        console.log("Next is the signIn jwt token value");
                        console.log(obj.jwtToken);
                        setJwtToken(obj.jwtToken || "");
                        setRefreshToken(obj.refreshToken || "");
                        setGoogleMessage("Logged In Successfully");
                        setUserProfile(user);
                        setUserToken(idToken);
                        saveJwtToken(obj.jwtToken);
                    } else {
                        console.log("No JWT Token returned from server.");
                    }
                } catch (error) {
                    console.log("We got some error here.")
                    console.error('Error:', error);
                }
            } else {
                console.log("NOT Successful: ", response.data );
                setGoogleMessage( "Not Successful");
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");
                deleteJwtToken();
            }
        } catch (error) {
            console.log("Error: ", error );

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                setGoogleMessage('User cancelled the login flow');
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");
                deleteJwtToken();

            } else if (error.code === statusCodes.IN_PROGRESS) {
                setGoogleMessage('Sign in is in progress already');
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");
                deleteJwtToken();
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                setGoogleMessage('Play services not available or outdated');
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");
                deleteJwtToken();
            } else {
                setGoogleMessage(`Some other error happened: ${error.message}`);
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");
                deleteJwtToken();
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
            deleteJwtToken();

            // need to do GoogleSignin.disconnect also.
        } catch (error) {
            console.log('Google Sign-Out Error: ', error);
        }
    }

    return (
        <GoogleAuthContext.Provider value={{ signIn, signOut, googleMessage, setGoogleMessage, userToken, userProfile, jwtToken, refreshJwtToken, setJwtToken, saveJwtToken, retrieveJwtToken, deleteJwtToken }}>
            { children }
        </GoogleAuthContext.Provider>
    );
    
}
