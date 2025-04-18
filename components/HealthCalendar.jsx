import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Calendar } from 'react-native-calendars';

export default function HealthCalendar() {
    
    const [selectedDate, setselectedData] = useState("");



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>
      <Calendar style={{color:'black'}}
        onDayPress={(day) => setselectedData(day.dateString)}
        markedDates={{
            [selectedDate]:{selected: true, selectedColor:"orange"}
        }}

        theme={{
          backgroundColor: 'black',
          calendarBackground: 'black',
          dayTextColor: 'white',
          
          monthTextColor: 'rgb(89, 244, 252)',
          arrowColor: 'orange',
          textDisabledColor: 'gray',
          selectedDayBackgroundColor: 'orange',
          todayTextColor: 'rgb(89, 244, 252)'
        }}
      />
      <Text style={{color:'white'}}>Selected Date: {selectedDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:20,
        backgroundColor:'black',

    },
    title:{
        fontSize:18,
        fontWeight:'bold',
        marginBottom:10,
        color:'white'
    },
    selectedText:{marginTop:10, fontSize:16, fontWeight:'bold'},
});