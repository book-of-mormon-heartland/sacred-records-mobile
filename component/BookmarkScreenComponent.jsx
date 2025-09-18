import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { GoogleAuthContext, refreshJwtToken } from '.././context/GoogleAuthContext';
import { Platform } from 'react-native';
import { useNavigation, navigate } from '@react-navigation/native';
import { Bookmark } from "react-native-feather";
import BookStackNavigatorComponent from './BookStackNavigatorComponent';



const BookmarksScreenComponent = ( {route} ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { jwtToken, refreshToken } = useContext(GoogleAuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }
  const  apiEndpoint = serverUrl + "/bookmarks/getBookmarks"; // Example endpoint

/*
navigation.navigate('ChapterContent', {
                       id: item.id,
                       title: item.title,
                   });
*/
  const renderItem = ({ item }) => {
    console.log(item);
    return(
      <TouchableOpacity
            style={styles.listItem}
            onPress={( ) => {
              // Handle navigation to the chapter text
              navigation.navigate('Bookshelf', {
                    screen: 'ChapterContent',
                    params: { 
                      id: item.chapterId,
                      title: item.chapterTitle,
                      positionX: 0,
                      positionY: item.positionY,
                      bookId: item.bookId,
                      fetchBookmark: "yes",
                    },
                  });
            }}
          >
        <Bookmark  stroke="black" fill="#fff" width={22} height={22} />
        <View style={styles.textContainer}>
          <Text style={styles.chapterTitle}>{item.bookTitle}</Text>
          <Text style={styles.chapterSubtitle}>{item.chapterTitle}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  //let newEndpoint = apiEndpoint + "?parent=" + id;
  const fetchData = async () => {
    try {
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      if (!response.ok) {
        console.log("response was not okay - ChaptersScreenComponent")
        //throw new Error(`HTTP error! status: ${response.status}`);
        if(response.status === 500) {
          console.log("Token may be expired, attempting refresh");
          await refreshJwtToken;
          console.log("Retrying fetch after token refresh");
          return fetchData(); // Retry fetching data after refreshing token   
        }
      }
      const json = await response.json();
      console.log("json");
      console.log(json);
      setData(json);
    } catch (error) {
      console.log("Error");
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      return () => {
      };
    }, [])
  );
/*
  useEffect(() => {
    //console.log("ChapterScreenComponent: apiEndpoint=", apiEndpoint);
    fetchData();
  }, []); // Empty dependency array means this runs once on mount
*/

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
    paddingLeft: 20,
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
  bookmarkContainer: {
    paddingRight: 10,
  }
});

export default BookmarksScreenComponent;