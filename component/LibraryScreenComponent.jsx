import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import { Platform } from 'react-native';
import { useNavigation, navigate } from '@react-navigation/native';


const LibraryScreenComponent = ( ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { jwtToken, refreshToken } = useContext(GoogleAuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isIOS = ( Platform.OS === 'ios' );
  const  apiEndpoint = Environment.NODE_SERVER_URL + "/rest/GET/Books"; // Example endpoint
  const navigation = useNavigation();



  const handlePress = (id) => {    
    navigation.navigate('Book', { 
      id: id,
    });
  };

  const renderItem = ({ item }) => {
    return(
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => handlePress(item.id)}>
        <Image source={{ uri: item.thumbnail }} style={styles.image} />
        </TouchableOpacity>
        <Text style={styles.text}>{item.title}</Text>
      </View>
    );
  }

  useEffect(() => {
    console.log("LibraryScreenComponent: apiEndpoint=", apiEndpoint);
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        });
        if (!response.ok) {
          console.log("response was not okay")
          throw new Error(`HTTP error! status: ${response.status}`);
        }
 
        console.log("we got results");
        const json = await response.json();
        console.log(json);
        setData(json);
      } catch (error) {
        console.log("Error");
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Empty dependency array means this runs once on mount



  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()} // Adjust keyExtractor based on your data structure        numColumns={2}
        numColumns={2}
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
    justifyContent: 'top',
    alignItems: 'center',
  },
listContainer: {
    paddingHorizontal: 5,
  },
  itemContainer: {
    width: 150,
    height: 150,
    padding: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: '100%', // Take up the full width of the item container
    aspectRatio: 1, // Maintain a square aspect ratio for thumbnails
    borderRadius: 8,
  },
  text: {
    marginTop: 5,
    textAlign: 'center',
  },
});

export default LibraryScreenComponent;