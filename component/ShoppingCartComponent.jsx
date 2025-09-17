import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';

const isIOS = ( Platform.OS === 'ios' );
let serverUrl = Environment.NODE_SERVER_URL;
if(isIOS) {
    serverUrl = Environment.IOS_NODE_SERVER_URL;
}
const  apiEndpoint = serverUrl + "/rest/GET/bookForReview"; // Example endpoint
const { userProfile } = useContext(GoogleAuthContext);



export const useCreatePaymentIntent = (paymentData) => {
    const [paymentIntentData, setPaymentIntentData] = useState(null);
    const [paymentIntentLoading, setPaymentIntentLoading] = useState(false);
    const [paymentIntentError, setPaymentIntentError] = useState(null);

    const createPaymentIntent = async (paymentData) => {
        setPaymentIntentLoading(true);
        setPaymentIntentError(null);
        try {
            console.log(serverUrl);
            const response = await fetch(serverUrl + '/payments/intent', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                // Add any other headers, like authorization tokens, here
                },
                body: JSON.stringify(paymentData.amount),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setPaymentIntentData(result);
            return result; // Return the data for immediate use if needed
        } catch (err) {
        setPaymentIntentError(err);
        throw err; // Re-throw the error to be caught by the component
        } finally {
        setPaymentIntentLoading(false);
        }
    };

    return { createPaymentIntent, paymentIntentData, paymentIntentLoading, paymentIntentError };
};



const ShoppingCartComponent = ( {navigation} ) => {

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 8,
    margin: 10,
    justifyContent: 'top',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
  },
});

export default ShoppingCartComponent;