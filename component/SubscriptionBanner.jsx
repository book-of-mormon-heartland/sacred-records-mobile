import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';var Environment = require('.././context/environment.ts');
import { Platform } from 'react-native';



const SubscriptionBanner = () => {

  const {  jwtToken } = useContext(GoogleAuthContext);
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }

  
  const signUp = async () => {
    console.log("Attempting Signup");
    // make rest call to sign up.
    //const  apiEndpoint = serverUrl + "/subscriptionss/getBooksByCategory?category=quetzal-condor"; // Example endpoint
    //const  apiEndpoint = serverUrl + "/subscriptions/getSubscriptions?category=quetzal-condor"; // Example endpoint
    /*
    const  apiEndpoint = serverUrl + "/subscriptions/getSubscriptions"; // Example endpoint
    console.log(apiEndpoint);
    try {
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      if (!response.ok) {
        console.log("Response not okay")
      } else {
        const json = await response.json();
        console.log(json);

        const message = JSON.parse(json);
        console.log(message.subscriptions);
        if (message.subscriptions.includes("quetzal-condor")) {
          console.log("Subscribed");
        } else {
          console.log("Not Subscribed"); 
        }

        //setData(json);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
    */

  }


  return (
    <LinearGradient
      colors={['#6a11cb', '#2575fc']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.bannerContainer}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>Major Release</Text>
        <Text style={styles.subtitle}>The Maya Quetzal Bio Region Council has released these records for public viewing.  Read the stories from the record keepers from numerous tribes from North America to South America.</Text>
        <TouchableOpacity style={styles.button} onPress={() => subscribe() }>
            <Text style={styles.buttonText}>Subscribe Today</Text>
        </TouchableOpacity>
        <Text style={styles.secondSide}>
            75% of proceeds go to the Maya Quetzal Bio Region Council.
        </Text>
        <Text style={styles.price}>Only $9.99 per month.</Text>
      </View>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    padding: 5,
    marginHorizontal: 16,
    borderRadius: 15,
    marginTop: 5,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e0e0',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ffdb58', // A contrasting color
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginRight: 10,
  },
  buttonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secondSide: {
    fontSize: 14,
    color: '#e0e0e0',
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    color: '#ffdb58',
    marginBottom: 10,
  },
});

export default SubscriptionBanner;