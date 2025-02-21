import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor:'black'
    }}>
        <Tabs.Screen name='mydiet'
          options={{
            tabBarLabel: 'My Diet',
            tabBarIcon: ({color}) => <MaterialIcons name="local-airport" size={24} color={color} />
          }}
        />
        <Tabs.Screen name='discover'
        options={{
          tabBarLabel: 'Fitness',
          tabBarIcon: ({color}) => <FontAwesome5 name="search-location" size={24} color={color} />
        }}
        />
        <Tabs.Screen name='profile'
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => <Ionicons name="people" size={24} color={color} />
        }}
        />
    </Tabs>
  )
}