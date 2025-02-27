import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Install: npm install @react-native-picker/picker
import { MotiView, MotiText } from "moti"; // Install: npm install moti
import { auth, db} from "../../configs/FirebaseConfigs";
import {doc, setDoc} from 'firebase/firestore';

const BMICalculator = () => {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(60);
  const [age, setAge] = useState(25);
  const [heartRate, setHeartRate] = useState(72);
  const [bloodPressure, setBloodPressure] = useState({ systolic: 120, diastolic: 80 });

  const animatedScale = {
    from: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: "spring", duration: 500 },
  };

  const calculateBMI = (height, weight) => {
    const heightInMeters = height/100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const bmi = calculateBMI(height, weight)

  const saveHealthData = async () =>{
    if(!height||!weight||!age||!heartRate||!bloodPressure){
      Alert.alert("Please Enter all your Vitals")
      return;
    }
    try{
      const userId = auth.currentUser.uid;

      await setDoc(doc(db, "Vitals", userId),{
        height: height,
        weight: weight,
        bmi:bmi,
        age: age,
        heartRate: heartRate,
        bloodPressure: bloodPressure,
        updatedAt: new Date(),
      });
      Alert.alert("Your Vitals has been stored!");
    }
    catch(error){
      console.error("Error in saving the data: ", error);
      Alert.alert("Failed to save the data")

    }
  }

  return (
    <View style={styles.container}>
      <MotiText from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1000 }} style={styles.title} >
        Vitals
      </MotiText>

      <MotiText from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1500 }} style={styles.subtitle}>
        Measure your vitals and check your BMI status.
      </MotiText>

      {/* Height Picker */}
      <MotiView {...animatedScale} style={styles.section}>
        <Text style={styles.label}>Height</Text>
        <Picker selectedValue={height} onValueChange={(itemValue) => setHeight(itemValue)} style={styles.picker}>
          {Array.from({ length: 80 }, (_, i) => 120 + i).map((h) => (
            <Picker.Item key={h} label={`${h} cm`} value={h} color="black" />
          ))}
        </Picker>
      </MotiView>

      {/* Weight Picker */}
      <MotiView {...animatedScale} style={styles.section}>
        <Text style={styles.label}>Weight</Text>
        <Picker selectedValue={weight} onValueChange={(itemValue) => setWeight(itemValue)} style={styles.picker}>
          {Array.from({ length: 100 }, (_, i) => 30 + i).map((w) => (
            <Picker.Item key={w} label={`${w} kg`} value={w} />
          ))}
        </Picker>
      </MotiView>

      {/* Age Selection */}
      <MotiView {...animatedScale} style={styles.section}>
        <Text style={styles.label}>Age</Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => setAge(age > 0 ? age - 1 : 0)} style={styles.button}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <MotiText animate={{ scale: 1.2 }} transition={{ type: "spring" }} style={styles.value}>
            {age}
          </MotiText>
          <TouchableOpacity onPress={() => setAge(age + 1)} style={styles.button}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </MotiView>

      {/* Heart Rate */}
      <MotiView {...animatedScale} style={styles.section}>
        <Text style={styles.label}>Heart Rate (BPM)</Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => setHeartRate(heartRate - 1)} style={styles.button}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <MotiText animate={{ scale: 1.2 }} transition={{ type: "spring" }} style={styles.value}>
            {heartRate} BPM
          </MotiText>
          <TouchableOpacity onPress={() => setHeartRate(heartRate + 1)} style={styles.button}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </MotiView>

      {/* Blood Pressure */}
      <MotiView {...animatedScale} style={styles.section}>
        <Text style={styles.label}>Blood Pressure</Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => setBloodPressure({ ...bloodPressure, systolic: bloodPressure.systolic - 1 })} style={styles.button}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <MotiText animate={{ scale: 1.2 }} transition={{ type: "spring" }} style={styles.value}>
            {bloodPressure.systolic}/{bloodPressure.diastolic} mmHg
          </MotiText>
          <TouchableOpacity onPress={() => setBloodPressure({ ...bloodPressure, systolic: bloodPressure.systolic + 1 })} style={styles.button}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </MotiView>

      {/* Submit Button */}
      <MotiView {...animatedScale}>
        <TouchableOpacity style={styles.startButton} activeOpacity={0.7} onPress={saveHealthData}>
          <MotiText animate={{ scale: 1.1 }} transition={{ type: "spring" }} style={styles.startButtonText}>
            Let's Begin
          </MotiText>
        </TouchableOpacity>
      </MotiView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: "#D4FF00",
    fontFamily:'outfit-bold'
  },
  subtitle: {
    textAlign: "center",
    color: "#D4FF00",
    marginVertical: 10,
    fontSize: 14,
    fontFamily:'outfit-bold'
  },
  section: {
    marginVertical: 10,
    alignItems: "left",
    width: "80%",
    padding: 15,
    backgroundColor: "#343A40",
    borderRadius: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#DEE2E6",
    marginBottom: 5,
    fontFamily:'outfit-bold'
  },
  picker: {
    width: "100%",
    borderRadius: 10,
    color: 'black'
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },
  value: {
    fontSize: 15,
    fontFamily:'outfit-medium',
    color: "black",
  },
  startButton: {
    marginTop: 20,
    backgroundColor: "#D4FF00",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    width: "80%"
  },
  startButtonText: {
    fontSize: 18,
    color: "black",
    fontFamily:'outfit-bold'
  },
});

export default BMICalculator;
