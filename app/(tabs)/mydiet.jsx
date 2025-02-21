import { View, Text } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
export default function MyDiet() {

  //const [userTrips, setUserTrips] = useState([]);


  return (
    <View style={{
      padding:25,
      paddingTop:55,
      backgroundColor:'white',
      height:'100%'
    }}>
      <View style={{
        display:'flex',
        flexDirection:'row',
        alignContent:'center',
        justifyContent:'space-between'
      }}>
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:35
        }}>My Diet</Text>
        <Ionicons name="add-circle-sharp" size={40} color="black" />
      </View>

      
      
    </View>
  )
}