import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import HealthCalendar from '../../components/HealthCalendar';
import { TouchableOpacity } from 'react-native';
export default function MyDiet() {



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
        color:'#D4FF00',
        textShadowColor: '#D4FF00',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
        }}>Fit Verse</Text>
        <TouchableOpacity 
          style={styles.addButton}
          activeOpacity={0.7}
          onPress={() => console.log("Add Progress")}
        >
          <Ionicons name="add-circle-sharp" size={60} color="#D4FF00" />
        </TouchableOpacity>

        </View>

      <HealthCalendar/>
      

      
      
    </View>
  )
}

const styles = StyleSheet.create({
  addButton:{
    borderRadius: 99,
    padding: 8,
    shadowColor: '#D4FF00',
    shadowOpacity: 0.4,
    shadowRadius: 3,
  }
})