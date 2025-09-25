import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, ScrollView } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import { Platform } from 'react-native';
import { useNavigation, navigate } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useI18n } from '.././context/I18nContext'; 




const QuetzalBookScreenComponent = ( ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { setJwtToken, jwtToken, refreshJwtToken } = useContext(GoogleAuthContext);
  const { language, setLanguage, translate } = useI18n();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const navigation = useNavigation();
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }

  useEffect(() => {
    if (jwtToken) {
      fetchData();
    }
  }, [jwtToken]); 

  const subscribe = async() => {
    console.log("hit subscribe button");
  } 

  const handlePress = (id, hasChildBooks, title) => {
    console.log("Will attempt navigation");
    console.log("id " + id);
    console.log("title " + title);
    
    if(hasChildBooks) {
      console.log("it has child books");
      navigation.navigate('Book', {
        id: id,
        title: title,
      });
    } else {
      console.log("it has no child books");
      navigation.navigate('Chapters', {
        id: id,
        title: title,
      });
    }

  };


  const determineIfBannerNeeded = async() => {
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
          setShowBanner(false);
        } else {
          console.log("Not Subscribed"); 
          setShowBanner(true);
        }

        //setData(json);
      }
    } catch (error) {
      console.log(error);
      setShowBanner(true);
    } finally {
    }


  }

  const fetchData = async () => {
    const  apiEndpoint = serverUrl + "/books/getBooksByCategory?category=quetzal-condor"; // Example endpoint
    try {
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      if (!response.ok) {
        console.log(response);
        if(response.status === 500) {
          const tokenRefreshObj = await refreshJwtToken();
          if(tokenRefreshObj.message === "valid-token" || tokenRefreshObj.message === "update-jwt-token") {
            console.log("newTokenValue " + tokenRefreshObj.jwtToken)
            setJwtToken(tokenRefreshObj.jwtToken);
            console.log("Maybe consider fetchData()");
            
          } else {
            // its been a week.  Login from this location.
            setJwtToken();
          }
        }
      } else {

        const json = await response.json();
        setData(json);
      }
    } catch (error) {
      console.log("Error");
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      determineIfBannerNeeded();
      fetchData();
      return () => {
      };
    }, [])
  );


  const renderItem = ({ item }) => {
    return(
      <View style={styles.container}>
        <TouchableOpacity onPress={() => handlePress(item.id, item.hasChildBooks, item.title)}>
        <Image source={{ uri: item.thumbnail }} style={styles.image} />
        </TouchableOpacity>
        <Text style={styles.text}>{item.thumbnailTitle}</Text>
      </View>
    );
  }

  const renderDummyItem = ({ item }) => {
    return(
      <View style={styles.container}>
        <TouchableOpacity >
        <Image source={{ uri: item.thumbnail }} style={styles.image} />
        </TouchableOpacity>
        <Text style={styles.text}>{item.thumbnailTitle}</Text>
        <Text style={styles.redText}>{translate("subscribe_to_view")}</Text>
      </View>
    );
  }


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }


  if(showBanner) {
    // show the banner and the items not clickable with message.
    return (
      <View  style={styles.container}>
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
        <FlatList
          data={data}
          renderItem={renderDummyItem}
          keyExtractor={(item, index) => index.toString()} // Adjust keyExtractor based on your data structure        numColumns={2}
          numColumns={3}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    );

  } else {
    return (
      <View  style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()} // Adjust keyExtractor based on your data structure        numColumns={2}
          numColumns={3}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    );
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 8,
    margin: 10,
    paddingBottom: 0,
    paddingTop: 10,
    marginBottom: 10,
    justifyContent: 'top',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 0,
    width: 350,

  },
  itemContainer: {

  },
  image: {
    width: '80', // Take up the full width of the item container
    height: '100', // Take up the full width of the item container
    //aspectRatio: 1, // Maintain a square aspect ratio for thumbnails
    borderRadius: 8,
  },
  text: {
    marginTop: 5,
    textAlign: 'center',
  },
  redText: {
    color: '#cc0000',
    marginTop: 5,
    textAlign: 'center',
  },
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

export default QuetzalBookScreenComponent;