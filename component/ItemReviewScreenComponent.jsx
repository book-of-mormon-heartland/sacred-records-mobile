import {
  Address,
  AddressDetails,
  AddressSheet,
  AddressSheetError,
  BillingDetails,
  CardBrand,
  CustomPaymentMethod,
  CustomPaymentMethodResult,
  CustomPaymentMethodResultStatus,
  PaymentMethodLayout,
  PaymentSheetError,
  useStripe,
} from '@stripe/stripe-react-native';
import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
var Environment = require('.././context/environment.ts');
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import { useI18n } from '.././context/I18nContext'; 
import { useNavigation, navigate } from '@react-navigation/native';
import { StripeProvider, presentPaymentSheet, initPaymentSheet, getClientSecretParams } from '@stripe/stripe-react-native';



const ItemReviewScreenComponent = ( {route} ) => {

  const { language, setLanguage, translate } = useI18n();
  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { jwtToken, refreshToken, userProfile } = useContext(GoogleAuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { id } = route.params;
  const { title } = route.params;
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }
  const  apiEndpoint = serverUrl + "/rest/GET/bookForReview"; // Example endpoint

  const [bookSubtitle, setBookSubtitle] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookId, setBookId] = useState("");
  const [bookImage, setBookImage] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [bookPrice, setBookPrice] = useState("");
  const [bookPriceText, setBookPriceText] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [discountPriceText, setDiscountPriceText] = useState("");
  const [inputDiscountCode, setInputDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const stripeKey=Environment.STRIPE;



  const applyDiscount = () => {
    console.log("Apply discount");
    if(inputDiscountCode.toLowerCase() === discountCode.toLowerCase() ) {
      console.log("They are a match.  Apply the Discount");
      setBookPrice(discountPrice);
      setBookPriceText(discountPriceText);
      setDiscountApplied(true);
    } else {
      console.log("Wrong code.  No discount");
    }

  }
 
  const addToBookshelf = async () => {
    console.log("Purchasing");
    const response = await createPaymentIntent({
      amount: Math.floor(bookPrice),
    });
    console.log("paymentIntent follows");
    console.log(response.client_secret);
    console.log(userProfile.name);
   // 2. Initialize the Payment sheet
    const { error: paymentSheetError } = await initPaymentSheet({
      merchantDisplayName: 'Sacred Records',
      paymentIntentClientSecret: response.client_secret,
      defaultBillingDetails: {
        name: userProfile.name,
      },
    });
    console.log("now checking for paymentsheet error");
    if (paymentSheetError) {
      Alert.alert('Something went wrong', paymentSheetError.message);
      return;
    }
    // 3. Present the Payment Sheet from Stripe
    console.log("about the presentPaymentSheet");
    const { error: paymentError } = await presentPaymentSheet();
    console.log("now checking for payment Error")
    if (paymentError) {
      Alert.alert(`Error code: ${paymentError.code}`, paymentError.message);
      return;
    }
    onCreateOrder();

  }

  const createPaymentIntent = async () => {
    try {
        const response = await fetch(serverUrl + '/payments/intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ amount: Math.floor(bookPrice) }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const paymentIntent = await response.json();
        return paymentIntent;
    } catch (err) {
      console.log(err);
      return (err);
    }
  };

  const onCreateOrder = async() => {
    console.log("Lets now make the rest call to the server to announce the purchase with details.");
    try {
      const response = await fetch(serverUrl + '/payments/createOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          },
          body: JSON.stringify({ 
            id: bookId,
            title: bookTitle,
            code: inputDiscountCode,
            bookPrice: Math.floor(bookPrice) 
          }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const createdOrder = await response.json();
  
      // navigate to the Bookshelf
      console.log("createdOrder");
      console.log(createdOrder);

      if(createdOrder.message == "success") {
        // lets navigate
        navigation.navigate('Bookshelf', { });
      }

    } catch (err) {
      console.log(err);
      return (err);
    } 
  }

  useEffect(() => {
    let newEndpoint = apiEndpoint + "?id=" + id;
    const fetchData = async () => {
      try {
        const response = await fetch(newEndpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        });
        if (!response.ok) {
          console.log("response was not okay")
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        let myBook = json[0];
        console.log(myBook);
        setBookId(myBook.id);
        setBookTitle(myBook.title);
        setBookSubtitle(myBook.subTitle);
        setBookImage(myBook.image);
        setBookDescription(myBook.Description);
        setBookPrice(myBook.price);
        setBookPriceText(myBook.priceText);
        setDiscountCode(myBook.discountCode);
        setDiscountPrice(myBook.discountPrice);
        setDiscountPriceText(myBook.discountPriceText);

      } catch (error) {
        console.log("Error");
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.scrollViewContainer}  horizontal={false}>
      <Text style={styles.headerTitle}>{bookTitle}</Text>
      <Text style={styles.subHeaderTitle}>{bookSubtitle}</Text>
      <Image
        source={{ uri: bookImage }}
        style={styles.productImage}
      />

      <Text style={styles.text}>{bookDescription}</Text>
      <Text style={styles.priceText}>Price: {bookPriceText}</Text>

      <ScrollView contentContainerStyle={styles.scrollViewContent} horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.centerWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Discount Code"
              value={inputDiscountCode}
              onChangeText={setInputDiscountCode}
            />
            <TouchableOpacity style={styles.applyDiscountButton} onPress={() => applyDiscount()}  activeOpacity={0.7}>
              <Text style={styles.buttonText}>{translate('apply_discount')}</Text>
            </TouchableOpacity>
          </View>
      </ScrollView>
      {discountApplied && <Text style={styles.discountApplied}>Discount Applied</Text>}
      <StripeProvider
            publishableKey={stripeKey} // Replace with your actual publishable key
            urlScheme="com.sacredrecords" // Optional: required for 3D Secure and other payment methods
            merchantIdentifier="merchant.io.trisummit" // Optional: required for Apple Pay
          >
        <TouchableOpacity style={styles.button} onPress={() => addToBookshelf()}  activeOpacity={0.7}>
          <Text style={styles.buttonText}>{translate('add_to_bookshelf')}</Text>
        </TouchableOpacity>
      </StripeProvider>
    </ScrollView>

  );
}
/*
<TouchableOpacity style={styles.button} onPress={() => paymentPage({bookId})} activeOpacity={0.7}>
        <Text style={styles.buttonText}>Purchase</Text>
      </TouchableOpacity>
*/

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
  scrollViewContainer: {
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: "center"
  },
  subHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: "center"
  },
  productImage: {
    paddingTop: 20, 
    width: '100%', 
    height: 400, 
    resizeMode: 'contain'
  },
  text: {
    fontSize: 14,
    padding:10
  },
  priceText: {
    fontSize: 14,
    paddingBottom: 10,
    fontWeight: 'bold',
    textAlign: "center"
  },
  discountCodeText: {
    width: 120, // Example width
    height: 20, // Example height
    backgroundColor: 'lightblue',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: 80, // Example width
    height: 20, // Example height
    backgroundColor: 'lightblue',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputItem: {
    width: 80, // Example width
    height: 20, // Example height
    backgroundColor: 'lightblue',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff', // Blue background
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android shadow
  },
  buttonText: {
    color: '#fff', // White text
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 10,
    
  },
  applyDiscountView: {
    flexGrow: 0,
    paddingBottom: 10,
  },
  applyDiscountButton: {
    height: 35,
    backgroundColor: '#007bff',
    color: '#fff', // Blue background
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android shadow
  },
  input: {
    height: 35,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 5,
    marginRight: 10
  },
  centerWrapper: {
    flex: 1, // This is key to make the wrapper fill the ScrollView's space.
    width: 400, // Explicitly setting the width to screen width.
    flexDirection: 'row', // As requested, items are side-by-side.
    justifyContent: 'center', // Centers children horizontally.
    alignItems: 'center', // Centers children vertically.
    // Optional: Add padding if you want spacing around the elements.
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    // This style ensures the ScrollView content area is at least the screen width.
    // This is optional but helps with the centering logic.
    minWidth: 250,
    paddingBottom: 20,
  },
  discountApplied: {
    fontSize: 12,
    marginBottom: 5,
    color: "#ff0033",
    textAlign: "center"
  },
});

export default ItemReviewScreenComponent;