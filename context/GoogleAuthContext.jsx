import { createContext, useState } from  "react";
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
var Environment = require('./environment.ts');
import { Platform } from 'react-native';


export const GoogleAuthContext = createContext("");

export const GoogleAuthProvider = ({ children }) => {

    const [message, setMessage] = useState("Not Signed In");
    const [userProfile, setUserProfile] = useState(undefined);
    const [userToken, setUserToken] = useState("");
    const [jwtToken, setJwtToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const isIOS = ( Platform.OS === 'ios' );
    let serverUrl = Environment.NODE_SERVER_URL;
    if(isIOS) {
        serverUrl = Environment.IOS_NODE_SERVER_URL;
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

                    if(obj?.jwtToken) {
                        setJwtToken(obj.jwtToken || "");
                        setRefreshToken(obj.refreshToken || "");
                        setMessage("Logged In Successfully");
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
                setMessage( "Not Successful");
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");
            }
        } catch (error) {
            console.log("Error: ", error );

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                setMessage('User cancelled the login flow');
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");

            } else if (error.code === statusCodes.IN_PROGRESS) {
                setMessage('Sign in is in progress already');
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                setMessage('Play services not available or outdated');
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");
            } else {
                setMessage(`Some other error happened: ${error.message}`);
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");
                setRefreshToken("");
            }
        }
    };


    const signOut = async () => {
        console.log("signOut");
        //const userid = userProfile?.id  || "0";
        /*. This whole block not needed, but keep here for reference.
        try {
            await GoogleSignin.signOut();
            try {
                const postResponse = await fetch(serverUrl + "/rest/POST/logout", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwtToken,
                    },
                    body: JSON.stringify({  }),
                });
                if (!postResponse.ok) {
                    throw new Error(`HTTP error! status: ${postResponse.status}`);
                }
                const responseData = await postResponse.json();
                
                console.log('Success:', responseData);
                // success of failure - default the to reset the user in app.
                setMessage('Signed Out'); 
                setUserProfile(undefined);
                setUserToken("");
                setJwtToken("");


            } catch (error) {
                console.error('Error:', error);
            }
            // Perform additional cleanup and logout operations.
            
        } catch (error) {
            console.log('Google Sign-Out Error: ', error);
        }
        */
        setUserProfile(undefined);
        setUserToken("");
        setJwtToken("");
        setRefreshToken("");
    }

    const fakeUserJson =
    {
        "user": {
            "id": "113764123641621274475", // A unique, immutable ID for the Google account
            "name": "Brian Nettles",           // The user's full name
            "email": "brian@trisummit.net", // The user's primary email address
            "photo": "https://lh3.googleusercontent.com/a/ACg8ocIaSR_dIv9yaRglsfbqTPzJNcxiej1BZVayC_gZ78IXmKTNvnAh=s96-c", // URL to the user's profile picture
            "givenName": "Brian",           // The user's first name
            "familyName": "Nettles"            // The user's last name
        }
    }


    const fakeSignIn = async () => {
        setMessage('Signed In (Fake)'); 
        setUserProfile(fakeUserJson.user);
        setJwtToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTM3NjQxMjM2NDE2MjEyNzQ0NzUiLCJpYXQiOjE3NTM5OTY1NjgsImV4cCI6MTc1NDAwMDE2OH0.U0QT1pKSKWB-2MKIdcvYrQSE81Tr1a-eIN_PACe_Xjs");
        setRefreshToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTM3NjQxMjM2NDE2MjEyNzQ0NzUiLCJpYXQiOjE3NTM5OTY1NjgsImV4cCI6MTc1NDYwMTM2OH0.mLpjqxHq4b259UJJCu3zMVMQkV66zsnLMb3p8knoNBo");
    }

    const fakeSignOut = async () => {
        setMessage('Signed Out (Fake)'); 
        setUserToken("");
        setJwtToken("");
        setRefreshToken("");
    }


    return (
        <GoogleAuthContext.Provider value={{ signIn, signOut, message, setMessage, userToken, userProfile, fakeSignIn, fakeSignOut, jwtToken, refreshToken }}>
            { children }
        </GoogleAuthContext.Provider>
    );
    
}
