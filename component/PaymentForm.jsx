
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';

function PaymentForm({ setupIntentClientSecret }) {
  const { confirmSetupIntent } = useStripe();
  const [cardDetails, setCardDetails] = useState(null);

  const handleSetupPayment = async () => {
    // 1. You should collect billing details (name, address, etc.) from the user.
    const billingDetails = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      // ... other billing details
    };

    // 2. Confirm the SetupIntent using the client secret from your server
    const { setupIntent, error } = await confirmSetupIntent(
      setupIntentClientSecret,
      {
        type: 'Card', // For card payments
        billingDetails,
      },
    );

    if (error) {
      console.log('SetupIntent confirmation failed', error);
      // Handle error, show message to user
    } else if (setupIntent && setupIntent.status === 'Succeeded') {
      console.log('Payment method saved!', setupIntent.paymentMethodId);
      // **Success!**
      // Send the setupIntent.paymentMethodId back to your server to create the subscription.
    }
  };

  return (
    <View>
      <CardField
        postalCodeEnabled={false} // Adjust as needed
        onCardChange={(details) => setCardDetails(details)}
        style={{ height: 50, marginVertical: 20 }}
      />
      <Button
        title="Save Payment Method"
        onPress={handleSetupPayment}
        disabled={!cardDetails || !cardDetails.complete}
      />
    </View>
  );
}