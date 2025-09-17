import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeContext } from ".././context/ThemeContext";
import { GoogleAuthContext } from ".././context/GoogleAuthContext";
import BookmarkScreenComponent from './BookmarkScreenComponent'; // Adjust path as needed
import SettingsScreenComponent from './SettingsScreenComponent'; // Adjust path as needed
import HomeScreenComponent from './HomeScreenComponent'; // Adjust path as needed
import BookStackNavigatorComponent from './BookStackNavigatorComponent';
import StoreStackNavigatorComponent from './StoreStackNavigatorComponent';
//import StoreScreenComponent from './StoreScreenComponent'; // Adjust path as needed
import { BookOpen, Home, Bookmark, Settings, Search, ShoppingCart } from "react-native-feather";
import { useI18n } from '.././context/I18nContext'; 

const Tab = createBottomTabNavigator();

const TabsComponent = ( ) => {

    const { theme, setTheme } = useContext(ThemeContext);
    const { userToken, userProfile  } = useContext(GoogleAuthContext);
    const { language, setLanguage, translate } = useI18n();
    
    
/*
<Tab.Screen name="Library-Main" component={BookStackNavigatorComponent} 
*/

    if (userToken?.length>0) {
        return (
            <Tab.Navigator>
                <Tab.Screen name="Bookshelf" component={BookStackNavigatorComponent}
                    options = {{
                        headerShown: false,
                        headerTitleAlign: 'center',
                        tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
                        tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
                        tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
                        tabBarShowLabel: true,
                        title: translate('bookshelf'), // The key should correspond to your translation file
                        tabBarIcon: ({focused}) => (
                            <View>
                                <BookOpen  stroke="black" fill="#fff" width={22} height={22}/>
                            </View>
                        )
                    }}
                />
                <Tab.Screen name="Shopping" component={StoreStackNavigatorComponent} 
                    options = {{
                        headerShown: false,
                        headerTitleAlign: 'center',
                        tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
                        tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
                        tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
                        tabBarShowLabel: true,
                        title: translate('store'), // The key should correspond to your translation file
                        tabBarIcon: ({focused}) => (
                            <View>
                                <ShoppingCart  stroke="black" fill="#fff" width={22} height={22}/>
                            </View>
                        )
                    }}
                />
                <Tab.Screen name="Bookmark" component={BookmarkScreenComponent} 
                    options = {{
                        headerShown: true,
                        headerTitleAlign: 'center',
                        tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
                        tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
                        tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
                        tabBarShowLabel: true,
                        title: translate('bookmark'), // The key should correspond to your translation file
                        tabBarIcon: ({focused}) => (
                            <View>
                                <Bookmark  stroke="black" fill="#fff" width={22} height={22}/>
                            </View>
                        )
                    }}
                />
                

                <Tab.Screen name="Settings" component={SettingsScreenComponent} 
                    options = {{
                        disabled: userToken?.length>0 ? true : false,
                        headerTitleAlign: 'center',
                        headerShown: true,
                        tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
                        tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
                        tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
                        tabBarShowLabel: true,
                        title: translate('settings'), // The key should correspond to your translation file
                        tabBarIcon: ({focused}) => (
                            <View>
                                <Settings stroke="black" fill="#fff" width={22} height={22}/>
                            </View>
                        )
                    }}
                />
            </Tab.Navigator>
        );
    } else {
        return (
            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeScreenComponent} 
                    options = {{
                        headerShown: true,
                        tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
                        tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
                        tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
                        tabBarShowLabel: true,
                        title: translate('home'), // The key should correspond to your translation file
                        tabBarIcon: ({focused}) => (
                            <View>
                                <Home  stroke="black" fill="#fff" width={22} height={22} />
                            </View>
                        )
                    }}
                />
            </Tab.Navigator>
        );
    }
}

export default TabsComponent;


/*
                <Tab.Screen name="Search" component={SearchScreenComponent} 
                    options = {{
                        headerShown: true,
                        headerTitleAlign: 'center',
                        tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
                        tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
                        tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
                        tabBarShowLabel: true,
                        title: translate('search'), // The key should correspond to your translation file
                        tabBarIcon: ({focused}) => (
                            <View>
                                <Search  stroke="black" fill="#fff" width={22} height={22}/>
                            </View>
                        )
                    }}
                />

                */