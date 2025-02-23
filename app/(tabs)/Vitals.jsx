import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import {auth, db} from "../../configs/FirebaseConfigs";
import {doc, setDoc} from "firebase/firestore";
import { TextInput } from 'react-native';
export default function Vitals() {
  const [bmi,setBMI] = useState("");
  const [bp,setbp] = useState("");
  const [sugar, setSugar] = useState("");

  const saveHealthData = async () => {
    if (!bmi || !bp || !sugar){
      Alert.alert("Please Enter all your Vitals")
      return;
    }
    try{
      const userId = auth.currentUser.uid;

      await setDoc(doc(db, "healthData", userId),{
        bmi:bmi,
        bloodPressure:bp,
        sugarLevel:sugar,
        updatedAt: new Date(),
      });
      Alert.alert("Health Data Saved")

    }catch(error){
      console.error("Error in saving the data: ", error)
      Alert.alert("Failed to save data")
    }
  }





  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Health Data</Text>
      <Text>BMI</Text>
      {/**BMI Input */}
      <TextInput 
       style = {styles.input}
       placeholder='Enter BMI'
       keyboardType='numeric'
       
       onChangeText={setBMI}
      />
      <Text>Blood Pressure</Text>

      <TextInput 
       style={styles.input}
       placeholder='Enter Blood Pressure in Hg'
       keyboardType='numeric'
       
       onChangeText={setbp}
       />

      <Text>Sugar</Text>
       <TextInput 
       style={styles.input}
       placeholder='Enter the Sugar Level'
       keyboardType='numeric'
       
       onChangeText={setSugar}
       />

       <TouchableOpacity style={styles.button} onPress={saveHealthData}>
        <Text style={{color:'white'}}>Save Data</Text>
       </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding:20
  },
  title:{
    fontSize:20,
    fontWeight:'bold',
    marginBottom:20
  },
  input:{
    width:'80%',
    padding:12,
    borderWidth:8, 
    marginBottom:10
  },
  button:{
    backgroundColor:'black',
    padding:15,
    borderRadius:8,
    marginTop:10,
    
  },
  buttonText:{
      color:'white',
      fontWeight:'bold'
  }
})