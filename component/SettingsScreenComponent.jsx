import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Button, Switch } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import { Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useI18n } from '.././context/I18nContext'; 



const SettingsScreenComponent = ( {navigation} ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { signOut,  refreshJwtToken, setJwtToken, saveJwtToken, retrieveJwtToken, deleteJwtToken } = useContext(GoogleAuthContext);
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const isIOS = ( Platform.OS === 'ios' );
  const { language, setLanguage, translate } = useI18n();
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }



  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const isSubscribedResult = await checkIfSubscribed();
        console.log(isSubscribedResult);
        // the effect is the opposite of what I am use to.
        setIsSubscribed(!isSubscribedResult);
      };
      loadData();

      return () => {
        // cleanup logic
      };
    }, []) // Dependencies array
  );

  const checkIfSubscribed = async() => {
    const myJwtToken = await retrieveJwtToken()
    try {
      const response = await fetch(serverUrl + "/subscriptions/checkIfSubscribed", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${myJwtToken}`
          },
          body: JSON.stringify({ 
              subscription: "quetzal-condor"
          }),
      });
      if (!response.ok) {
        if(response.status === 500) {
          const tokenRefreshObj = await refreshJwtToken();
          if(tokenRefreshObj.message === "valid-token" || tokenRefreshObj.message === "update-jwt-token") {
            setJwtToken(tokenRefreshObj.jwtToken);
            saveJwtToken(tokenRefreshObj.jwtToken);
          } else {
            setJwtToken();
            deleteJwtToken();
          }
        } else {
          console.log("Other error in subscriptions/subscribe");
        }
      } else {
        const responseData = await response.json();
        const obj = JSON.parse(responseData);
        if(obj.isSubscribed) {
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
       return false;
    }
  }

  const handleSubscribeToggle = (newValue) => {
      console.log(`New value for subscribed: ${newValue}`);
      setIsSubscribed(newValue); // Update the state with the new value
  };

  const  setLanguageEndpoint = serverUrl + "/rest/POST/setLanguage"; // Example endpoint  
  const saveLanguage = async (selectedLanguage) => {
    setLoading(true);    
    const myJwtToken = await retrieveJwtToken();
    try {
      const response = await fetch(setLanguageEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${myJwtToken}`
        },
        body: JSON.stringify({ language: selectedLanguage }),
      });
      if (!response.ok) {
        if(response.status === 500) {
          const tokenRefreshObj = await refreshJwtToken();
          if(tokenRefreshObj.message === "valid-token" || tokenRefreshObj.message === "update-jwt-token") {
            setJwtToken(tokenRefreshObj.jwtToken);
            await saveJwtToken(tokenRefreshObj.jwtToken);
          } else {
            // its been a week.  Login from this location.
            setJwtToken();
            await deleteJwtToken();
          }
        }
      } else {
        const json = await response.json();
      }
    } catch (error) {
      console.log("Error in settingsScreenComponent");
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const selectLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    saveLanguage(selectedLanguage);
  }

  return (
    <View>
      <>
        <View  style={styles.container}>
          <View style={styles.settingItem}>
            <Text style={styles.settingTitle}>{translate('signed_in')}</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#3FDD57FF' }}
              thumbColor={'#ffffff'}
              ios_backgroundColor="#3fdd57"
              onValueChange={signOut}
              value={false}
            />
          </View>
        </View>
      </>
      <>
      <View  style={styles.container}>
        <View style={{ height: 200, justifyContent: 'top' }}>
          <View style={styles.pickerContainer}>
            <Text style={styles.settingTitle}>{translate('select_language')}</Text>
            <Picker
            selectedValue={language}
            onValueChange={(itemValue) => selectLanguage(itemValue)}
            style={styles.picker}
          >
              <Picker.Item
                key={"en"}
                label={"English"}
                value={"en"}
              />
              <Picker.Item
                key={"es"}
                label={"Spanish"}
                value={"es"}
              />
  
            </Picker>
          </View>
        </View>
      </View>
      </>

      <>
      <View  style={styles.container}>
        <View style={styles.settingItem}>
          <Text style={styles.settingTitle}>{translate('unsubscribe')}</Text>
          <Switch
            trackColor={{ true: '#767577', false: '#3fdd57' }}
            thumbColor={'#ffffff'}
            ios_backgroundColor="#3fdd57"
            // 3. Pass the state variable to the 'value' prop
            value={isSubscribed}
            // 4. Pass the function reference to the 'onValueChange' prop
            onValueChange={handleSubscribeToggle} 
          />
        </View>
        <Text style={styles.settingDev}>In Development. To cancel your subscription, contact Brian Nettles at brian.nettles@trisummit.io or at 520-373-3224.</Text>
      </View>
      </>


      <>
      <View  style={styles.container}>
          <Text style={styles.settingTitle}>About</Text>
          <Text style={styles.Text}>Sacred Apps is a product of Trisummit Technologies LLC located in Tucson, AZ.</Text>
      </View>
      </>

      <>
      <View  style={styles.container}>
          <Text style={styles.settingTitle}>This App is in Beta Testing</Text>
          <Text style={styles.settingDev}>Please report anything not working in this application to brian.nettles@trisummit.io.</Text>
      </View>
      </>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {

    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 0,
    marginLeft: 10,
    marginRight: 10,
    
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',

  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
  },
  settingTitle: {
    paddingTop: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  settingDev: {
    color: "#ff0000",
    paddingTop: 10,
    fontSize: 14,
    textAlign: 'left',
  },
  label: {
    fontSize: 16,
    marginBottom: 0,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderColor: '#ccc',
    height: 200,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default SettingsScreenComponent;