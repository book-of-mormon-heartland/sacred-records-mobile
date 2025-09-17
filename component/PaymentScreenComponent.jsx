import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useStripe, CardForm, createToken , AddressSheet} from '@stripe/stripe-react-native';
import { useI18n } from '.././context/I18nContext'; 


const PaymentScreenComponent = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [cardDetails, setCardDetails] = useState(null);
  const { language, setLanguage, translate } = useI18n();
  

  const handleCardFormChange = (details) => {
    setCardDetails(details);
  };

  const createPaymentMethod = async () => {
    if (!cardDetails?.complete) {
      Alert.alert('Please enter complete card details.');
      return;
    }

    try {
      const { paymentMethod, error } = await createToken({
        type: 'Card',
        card: cardDetails,
      });

      if (error) {
        Alert.alert('Error creating token', error.message);
      } else {
        Alert.alert('Success!', 'Payment method token created successfully: ' + paymentMethod.id);
        // You would typically send this paymentMethod.id to your server
        // to complete the payment using the Stripe API.
      }
    } catch (error) {
      Alert.alert('An unexpected error occurred', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <AddressSheet />
      <CardForm
        style={styles.cardForm}
        onFormComplete={handleCardFormChange}
      />
      <TouchableOpacity style={styles.button}
        onPress={createPaymentMethod}
        disabled={!cardDetails?.complete}
      >
        <Text style={styles.buttonText}>{translate('make_payment')}</Text>
      </ TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  cardForm: {
    height: 250, // Adjust the height as needed
    marginVertical: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    backgroundColor: '#007bff', // White background for the button
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0', // Light gray border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // For Android shadow
  },
  buttonText: {
    color: '#ffffff', // Google's gray text color
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PaymentScreenComponent;