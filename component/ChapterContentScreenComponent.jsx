import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import { useNavigation, navigate } from '@react-navigation/native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
 

const ChapterContentScreenComponent = ( {route}) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { signIn, signOut, message, setMessage, userToken } = useContext(GoogleAuthContext);
  const { jwtToken, refreshToken } = useContext(GoogleAuthContext);
  const { id } = route.params;
  const navigation = useNavigation();
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }
  const  apiEndpoint = serverUrl + "/rest/GET/chapterContentText"; // Example endpoint
  const [paragraphs, setParagraphs] = useState([]);
  const [chapterSubtitle, setChapterSubtitle] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [previousChapter, setPreviousChapter] = useState("");
  const [followingChapter, setFollowingChapter] = useState("");
  const [chapterId, setChapterId] = useState("");


  useEffect(() => {
    let myId = ""
    if(chapterId=="") {
      myId=id;
    } else {
      myId=chapterId;
    }

    let newEndpoint = apiEndpoint + "?id=" + myId;
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
        console.log("We should have an array of content.")
        console.log(json);
        //establish the array here.
        //setData(json);
        let myChapter = json[0];
        setParagraphs(myChapter.content);
        setChapterTitle(myChapter.title);
        setChapterSubtitle(myChapter.subTitle);
        setPreviousChapter(myChapter.previousChapter);
        setFollowingChapter(myChapter.followingChapter);
        
        navigation.setOptions({
          title: myChapter.title,
        });

        //setData(json);
      } catch (error) {
        console.log("Error");
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [chapterId]); // Empty dependency array means this runs once on mount

  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Fade out, change chapter, then fade in
  const handleChapterChange = (newChapterId) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setChapterId(newChapterId);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };


  const onSwipeLeft = (gestureState) => {
  } 
  const onSwipeRight = (gestureState) => {
  }
 
  const onSwipe = (gestureName, gestureState) => {
    const {SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    switch (gestureName) {
      case SWIPE_LEFT:
        console.log("swiped left - " + followingChapter);
        if (followingChapter) handleChapterChange(followingChapter);
        break;
      case SWIPE_RIGHT:
        console.log("swiped right - " + previousChapter);
        if (previousChapter) handleChapterChange(previousChapter);
        break;
    }
  }

  const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
  };


  return (
    <ScrollView style={styles.container}>
      <GestureRecognizer
        onSwipe={(direction) => onSwipe(direction)}
        onSwipeLeft={() => onSwipeLeft()}
        onSwipeRight={() => onSwipeRight()}
        config={config}
        style={{
          flex: 1,
          //backgroundColor: state.backgroundColor
        }}
        >
      <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={styles.chapterTitle}>{chapterTitle}</Text>
      <Text style={styles.subTitle}>{chapterSubtitle}</Text>
      {paragraphs.map((paragraph, index) => (
        <View key={index} style={styles.paragraphContainer}>
          <Text style={styles.paragraphText}>
            {paragraph}
          </Text>
        </View>
      ))}
      </Animated.View>
      </GestureRecognizer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: 8,
    margin: 5,
  },
  paragraphContainer: {
    marginBottom: 16,
    justifyContent: 'top',
  },
  paragraphText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    justifyContent: 'top',
    alignItems: 'left',

  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChapterContentScreenComponent;