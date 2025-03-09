import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker"; 
import { MotiView, MotiText } from "moti"; 
import { auth, db } from "../../configs/FirebaseConfigs";
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from "expo-router";

const Vitals = () => {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(60);
  const [age, setAge] = useState(25);
  const [heartRate, setHeartRate] = useState(72);
  const [bloodPressure, setBloodPressure] = useState({ systolic: 120, diastolic: 80 });

  const router = useRouter();

  const animatedScale = {
    from: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: "spring", duration: 500 },
  };

  const calculateBMI = (height, weight) => {
    if (!height || height <= 0) return "N/A"; 
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const bmi = calculateBMI(height, weight);

  const saveHealthData = async () => {
    if (!height || !weight || !age || !heartRate || !bloodPressure) {
      Alert.alert("Please Enter all your Vitals");
      return;
    }
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("You are not logged in.");
        return;
      }
      const userId = user.uid;

      await setDoc(doc(db, "Vitals", userId), {
        height,
        weight,
        bmi,
        age,
        heartRate,
        bloodPressure,
        updatedAt: new Date(),
      });

      Alert.alert("Your Vitals have been stored!");
      router.replace('/mydiet');
    } catch (error) {
      console.error("Error in saving the data: ", error);
      Alert.alert("Failed to save the data");
    }
  };

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
        <Picker selectedValue={height} onValueChange={setHeight} style={styles.picker}>
          {Array.from({ length: 80 }, (_, i) => 120 + i).map((h) => (
            <Picker.Item key={h} label={`${h} cm`} value={h} style={{ color: 'black' }} />
          ))}
        </Picker>
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
    fontFamily: 'outfit-bold'
  },
  subtitle: {
    textAlign: "center",
    color: "#D4FF00",
    marginVertical: 10,
    fontSize: 14,
    fontFamily: 'outfit-bold'
  },
  section: {
    marginVertical: 10,
    alignItems: "left",
    width: "80%",
    padding: 15,
    backgroundColor: "#343A40",
    borderRadius: 20,
  },
  picker: {
    width: "100%",
    borderRadius: 10,
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
    fontFamily: 'outfit-bold'
  },
});

export default Vitals;
