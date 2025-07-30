import React, { useContext, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeContext } from ".././context/ThemeContext";
import { GoogleAuthContext } from ".././context/GoogleAuthContext";
import BookmarkScreenComponent from './BookmarkScreenComponent'; // Adjust path as needed
import ProfileScreenComponent from './ProfileScreenComponent'; // Adjust path as needed
import HomeScreenComponent from './HomeScreenComponent'; // Adjust path as needed


const Tab = createBottomTabNavigator();

const TabsComponent = ( ) => {

    const { theme, setTheme } = useContext(ThemeContext);
    const { userToken, userProfile  } = useContext(GoogleAuthContext);

    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreenComponent} />
            <Tab.Screen name="Bookmark" component={BookmarkScreenComponent} />
            <Tab.Screen name="Profile" component={ProfileScreenComponent} />
        </Tab.Navigator>
    );
}

export default TabsComponent;