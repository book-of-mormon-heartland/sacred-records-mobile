import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Image, TouchableOpacity, Icon } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { GoogleAuthContext } from '.././context/GoogleAuthContext';
import { useNavigation, navigate } from '@react-navigation/native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { ArrowRight, ArrowLeft } from "react-native-feather";

 

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
  const scrollViewRef = useRef(null);


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
          //throw new Error(`HTTP error! status: ${response.status}`);
          if(response.status==500) {
            console.log("refreshing token");
            await refreshToken();
            fetchData();
          }
        }
        const json = await response.json();
        //console.log("We should have an array of content.")
        //console.log(json);
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
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setChapterId(newChapterId);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
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

  const onPreviousPage = () => {
    if(previousChapter != "") {
      handleChapterChange(previousChapter);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }
  }

  const onNextPage = () => {
    if(followingChapter != "") {
      handleChapterChange(followingChapter);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }
  }



  const renderPoemText = (text) => {
    // Remove the [[poem: and ]] markers
    const poemContent = text.replace('[[poem:', '').replace(']]', '').trim();
    // Split the poem into lines based on newline characters
    const lines = poemContent.split('|');
    return lines.map((line, index) => (
      <Text key={index} style={styles.poemLine}>
        {'  '} {line} {'\n'}
      </Text>
    ));
  };

  const renderFormattedText = (text) => {
    // Base case: if no markdown is found, return the text as is.
    if (!text.includes('**') && !text.includes('*')) {
      return <Text>{text}</Text>;
    }

    // Handle bold first, as it's the more complex, potentially nested element.
    const boldParts = text.split('**');
    const renderedBoldParts = boldParts.map((boldPart, boldIndex) => {
      // If it's an even index, it's not a bold part, so check for italics.
      if (boldIndex % 2 === 0) {
        const italicParts = boldPart.split('*');
        return italicParts.map((italicPart, italicIndex) => {
          // If it's an odd index, it's an italic part.
          if (italicIndex % 2 === 1) {
            return (
              <Text key={`italic-${italicIndex}`} style={{ fontStyle: 'italic' }}>
                {italicPart}
              </Text>
            );
          }
          // Even index is normal text.
          return <Text key={`normal-${italicIndex}`}>{italicPart}</Text>;
        });
      }
      // Odd index is a bold part.
      return (
        <Text key={`bold-${boldIndex}`} style={{ fontWeight: 'bold' }}>
          {boldPart}
        </Text>
      );
    });
    return renderedBoldParts;
  };


  return (
    <ScrollView style={styles.container} ref={scrollViewRef}>
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
          { paragraph.startsWith("[[image:")?
            <Image
              source={{ uri: paragraph.replace('[[image:', '').replace(']]', '').trim() }}
              style={{ width: '100%', height: 400, resizeMode: 'contain' }}
            />
            : 
            paragraph.startsWith("[[poem:")? 
            <Text> 
              {renderPoemText(paragraph)}
            </Text>
            :
            <Text style={styles.paragraphText}>
              {renderFormattedText(paragraph)}
            </Text>
          }
        </View>
      ))}
      </Animated.View>
      </GestureRecognizer>

      {/* Navigation Buttons Container */}
      <View style={styles.navigationContainer}>
        {/* Previous Page Button */}
        <TouchableOpacity style={styles.button} onPress={() => onPreviousPage()}>
          <ArrowLeft  stroke="black" fill="#fff" width={22} height={22}/>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>

        {/* Next Page Button */}
        <TouchableOpacity style={styles.button} onPress={() => onNextPage()}>
          <Text style={styles.buttonText}>Next</Text>
          <ArrowRight  stroke="black" fill="#fff" width={22} height={22}/>
        </TouchableOpacity>
      </View>

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
  poemLine: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 22,
    paddingLeft: 20,
  },
  navigationContainer: {
    flexDirection: 'row', // Aligns children horizontally
    justifyContent: 'center', // Centers children horizontally within the container
    alignItems: 'center', // Centers children vertically
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#EFEFEF', // Light gray background
  },
  buttonText: {
    marginLeft: 5,
    marginRight: 5,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default ChapterContentScreenComponent;