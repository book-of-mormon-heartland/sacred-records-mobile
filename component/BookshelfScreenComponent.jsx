import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import { Platform } from 'react-native';
import { useNavigation, navigate } from '@react-navigation/native';


const BookshelfScreenComponent = ( ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { jwtToken, refreshJwtToken } = useContext(GoogleAuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }
  const  apiEndpoint = serverUrl + "/rest/GET/Bookshelf"; // Example endpoint

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      return () => {
      };
    }, [])
  );
/*
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this runs once on mount
*/
  const handlePress = (id, hasChildBooks, title) => {
    if(hasChildBooks) {
      navigation.navigate('Book', {
        id: id,
        title: title,
      });
    } else {
      navigation.navigate('Chapters', {
        id: id,
        title: title,
      });
    }

  };

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


  const fetchData = async () => {
    try {
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      if (!response.ok) {
        console.log("response was not okay");
        const results = await refreshJwtToken();
        console.log(results);
        throw new Error(`HTTP error! status: ${response.status} Go to the settings tab, log out and log back in.`);
      }
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.log("Error");
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };




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

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()} // Adjust keyExtractor based on your data structure        numColumns={2}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
      />
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
});

export default BookshelfScreenComponent;