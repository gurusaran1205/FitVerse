import { View, Text } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import HealthCalendar from '../../components/HealthCalendar';
export default function MyDiet() {

  //const [userTrips, setUserTrips] = useState([]);


  return (
    <View style={{
      padding:25,
      paddingTop:55,
      backgroundColor:'black',
      height:'100%'
    }}>
      <View style={{
        display:'flex',
        flexDirection:'row',
        alignContent:'center',
        justifyContent:'space-between'
      }}>
      <Text style={{
        fontFamily:'Caveat-Bold',
        fontSize:50,
        color:'#D4FF00'
        }}>Fit Verse</Text>
        <Ionicons name="add-circle-sharp" size={60} color="#D4FF00" />
      </View>

      <HealthCalendar/>
      

      
      
    </View>
  )
}