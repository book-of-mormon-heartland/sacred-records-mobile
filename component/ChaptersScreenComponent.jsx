import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import { Platform } from 'react-native';
import { useNavigation, navigate } from '@react-navigation/native';
import { BookOpen, ChevronRight } from "react-native-feather";



const ChapterScreenComponent = ( {route} ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { jwtToken, refreshToken } = useContext(GoogleAuthContext);
  const [data, setData] = useState([]);
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
  const  apiEndpoint = serverUrl + "/rest/GET/chapters"; // Example endpoint

  console.log("Chapters Screen id is " + id);


  const renderItem = ({ item }) => {
    return(
      <TouchableOpacity
            style={styles.listItem}
            onPress={( ) => {
              // Handle navigation to the chapter text
               navigation.navigate('ChapterContent', {
                       id: item.id,
                       title: item.title,
                   });
            }}
          >
        <View style={styles.textContainer}>
          <Text style={styles.chapterTitle}>{item.title}</Text>
          <Text style={styles.chapterSubtitle}>{item.subTitle}</Text>
        </View>
        <ChevronRight stroke="black" fill="#fff" width={22} height={22} />
      </TouchableOpacity>
    );
  }

  useEffect(() => {
    console.log("ChapterScreenComponent: apiEndpoint=", apiEndpoint);

    navigation.setOptions({
        title: title,
    });



    let newEndpoint = apiEndpoint + "?parent=" + id;
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
        numColumns={1}
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
    padding: 10,
  },
  listItem: {
    width:325,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 5,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textContainer: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chapterSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default ChapterScreenComponent;