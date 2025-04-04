import { View, Text } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor:'#D4FF00',
      tabBarInactiveTintColor:'gray',
      tabBarStyle:{
        backgroundColor:'black',
        borderTopWidth: 0,
        height:60,
      },
      tabBarLabelStyle:{
        fontSize: 12,
      },
    }}>
        <Tabs.Screen name='mydiet'
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color}) => <MaterialIcons name="sports-gymnastics" size={24} color={'#D4FF00'} />
          }}
        />
        <Tabs.Screen name='recommendation'
        options={{
          tabBarLabel: 'Recommendation',
          tabBarIcon: ({color}) => <FontAwesome5 name="search-location" size={24} color={'#D4FF00'} />
        }}
        />
        <Tabs.Screen name='profile'
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => <Ionicons name="people" size={24} color={'#D4FF00'} />
        }}
        />

        <Tabs.Screen name='Chatbot'
        options={{
          tabBarLabel: 'Arogya',
          tabBarIcon: ({color}) => <MaterialCommunityIcons name="robot" size={24} color="#D4FF00" />
        }}
        />

        <Tabs.Screen name='Communities'
        options={{
          tabBarLabel: 'Communities',
          tabBarIcon: ({color}) => <MaterialCommunityIcons name="transit-connection-variant" size={24} color="#D4FF00" />
        }}
        />
        
    </Tabs>
  )
}