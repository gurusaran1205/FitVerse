import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Calendar } from 'react-native-calendars';

export default function HealthCalendar() {
    
    const [selectedDate, setselectedData] = useState("");



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>
      <Calendar
        onDayPress={(day) => setselectedData(day.dateString)}
        markedDates={{
            [selectedDate]:{selected: true, selectedColor:"orange"}
        }}
      />
      <Text>Selected Date: {selectedDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:20,
        backgroundColor:'white',

    },
    title:{
        fontSize:18,
        fontWeight:'bold',
        marginBottom:10
    },
    selectedText:{marginTop:10, fontSize:16, fontWeight:'bold'},
});