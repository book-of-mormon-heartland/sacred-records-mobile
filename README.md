Before you start the application, you may need to ensure that a simulator is working.

This can be done on IOS by opening XCODE and creating a simulator.  Once created, it 
may work for good.

Same can be said for andriod.  You may need to open Android Studio and create a simulator.  
Once created, it may work for good.

To start the application, from the command line call:

npm run ios

or 

npm run android


App created using this command as it is a react native cli application.  Important to note it
does not use Expo.

npx @react-native-community/cli init sacredrecords

You may need to run these commands to start the application
npm i @react-native-google-signin/google-signin
cd ios
arch -x86_64 pod install

cd ..
cd android
keytool -keystore app/debug.keystore -list -v

There is an sh1 code here that is used in the google console for the creation of the android
version of the google client.  It should already be a match.  But interesting to see that if
it does not work, that could be a reason.

Libraries used in the application:


npm i @react-native-google-signin/google-signin

npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install @react-navigation/elements
npm install @react-navigation/bottom-tabs
npm i --save @fortawesome/fontawesome-svg-core @fortawesome/react-native-fontawesome@latest react-native-svg
npm i --save @fortawesome/free-solid-svg-icons
npm install @react-native-vector-icons/material-icons

Book of Mormon
3b8dac2b-7349-4536-a8ec-d57f8a7f3bde

Book of Mormon Introductions
a0492c07-165e-4d5d-b6cb-5459a312f187

