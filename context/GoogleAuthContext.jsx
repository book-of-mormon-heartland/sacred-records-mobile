import { createContext, useState } from  "react";
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
var Environment = require('./environment.ts');


export const GoogleAuthContext = createContext("");

export const GoogleAuthProvider = ({ children }) => {

    const [message, setMessage] = useState("Not Signed In");
    const [userProfile, setUserProfile] = useState(undefined);
    const [userToken, setUserToken] = useState("");
    
    const serverUrl = Environment.NODE_SERVER_URL;


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
                try {
                    const postResponse = await fetch(serverUrl + "/rest/POST/googlelogin", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token: response.data.idToken, user: response.data.user }),
                    });
                    if (!postResponse.ok) {
                        throw new Error(`HTTP error! status: ${postResponse.status}`);
                    }
                    const responseData = await postResponse.json();
                    console.log('Success:', responseData);
                } catch (error) {
                    console.error('Error:', error);
                }
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
        const userid = userProfile?.id  || "0";
        try {
            await GoogleSignin.signOut();
            try {
                const postResponse = await fetch(serverUrl + "/rest/POST/googlelogout", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({  userid: userid }),
                });
                if (!postResponse.ok) {
                    throw new Error(`HTTP error! status: ${postResponse.status}`);
                }
                const responseData = await postResponse.json();
                console.log('Success:', responseData);
            } catch (error) {
                console.error('Error:', error);
            }

            setMessage('Signed Out'); 
            setUserProfile(undefined);
            setUserToken("");

          // Perform additional cleanup and logout operations.
        } catch (error) {
            console.log('Google Sign-Out Error: ', error);
        }
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
        setUserToken("eyJhbGciOiJSUzI1NiIsImtpZCI6ImRkNTMwMTIwNGZjMWQ2YTBkNjhjNzgzYTM1Y2M5YzEwYjI1ZTFmNGEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzNzYxODU3NDc3MzgtaGExanFxMzJyb2V0YThnN2MzNGM3a29lbmQ3bG1wNW8uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzNzYxODU3NDc3MzgtaGNlZDU0cjhpMmpjNGJqcTQyOGk1NGRwMmc0dWhudm8uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTM3NjQxMjM2NDE2MjEyNzQ0NzUiLCJoZCI6InRyaXN1bW1pdC5uZXQiLCJlbWFpbCI6ImJyaWFuQHRyaXN1bW1pdC5uZXQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkJyaWFuIE5ldHRsZXMiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSWFTUl9kSXY5eWFSZ2xzZmJxVFB6Sk5jeGllajFCWlZheUNfZ1o3OElYbUtUTnZuQWg9czk2LWMiLCJnaXZlbl9uYW1lIjoiQnJpYW4iLCJmYW1pbHlfbmFtZSI6Ik5ldHRsZXMiLCJpYXQiOjE3NTM5MTY0MzMsImV4cCI6MTc1MzkyMDAzM30.SIOjB3FF2tlhY6cOjzCUitZ_hqOMQl835HsctjSsPga-1L_LbYc2LgrzkAuOx2f2DU0szbiOVvuTRexrC936ThdjAM6bVQcf1YS3Esjtbjz2WpPM-olCA0foZtTgalXvDyC1uJ4SER6tf3rq4kEolQ79GzK2SEfzz3x75SI3z9KTmwjGQt8iFx-f6-yNba9rIaQ6s-j_FfPjX9yrSoz4-i-hs9DDydFmpDdJ4-KyXih9M5tRiCEwbADVqaz1lWXI4alJFwluTV_D9TK-DD5rdb0otslb4YuViA8pf2z1PcLM9Sgnihp7W2upl5mRKm1nQPf50fQKBreMKAPDa7gO5A");
    }

    const fakeSignOut = async () => {

        setMessage('Signed Out (Fake)'); 
        setUserProfile(undefined);
        setUserToken("");
    }


    return (
        <GoogleAuthContext.Provider value={{ signIn, signOut, message, setMessage, userToken, userProfile, fakeSignIn, fakeSignOut }}>
            { children }
        </GoogleAuthContext.Provider>
    );
    
}
