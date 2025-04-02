import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../configs/FirebaseConfigs";
import { setDoc, doc } from "firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";

const Option1 = () => {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const router = useRouter();

  // Goal options
  const goals = [
    { id: "lose", title: "Lose Weight", image: require("../../assets/images/weight.jpg") },
    { id: "gain", title: "Gain Muscle", image: require("../../assets/images/muscle.jpg") },
    { id: "healthy", title: "Stay Healthy", image: require("../../assets/images/healthy.jpg") }
  ];

  // Save to Firebase and navigate
  const handleNext = async () => {
    if (!selectedGoal) {
      Alert.alert("Selection Required", "Please choose a goal before proceeding.");
      return;
    }

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert("Error", "You must be logged in.");
        return;
      }

      await setDoc(doc(db, "Users", userId), { goal: selectedGoal }, { merge: true });

      router.push("/mydiet"); // Navigate forward
    } catch (error) {
      console.error("Error saving goal:", error);
      Alert.alert("Error", "Failed to save goal. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="fitness-outline" size={30} color="#D4FF00" />
        <Text style={styles.title}>What is your <Text style={styles.highlight}>Goal?</Text></Text>
        <Text style={styles.subtitle}>We will use this data to give you a better diet & fitness plan.</Text>
      </View>

      {/* Goal Selection */}
      <View style={styles.goalContainer}>
        {goals.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.goalBox,
              selectedGoal === goal.id && styles.selectedGoal
            ]}
            onPress={() => setSelectedGoal(goal.id)}
          >
            <Image source={goal.image} style={styles.image} />
            <Text style={[
              styles.optionText,
              selectedGoal === goal.id && styles.selectedText
            ]}>
              {goal.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={[styles.nextButton, !selectedGoal && styles.disabledButton]}
        onPress={handleNext}
        disabled={!selectedGoal}
      >
        <Text style={styles.nextButtonText}>Next ›</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Option1;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: "#D4FF00",
    marginTop: 10,
  },
  highlight: {
    color: "#FFD700", // Gold accent
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#AAA",
    textAlign: "center",
    marginTop: 8,
  },
  goalContainer: {
    marginTop: 20,
  },
  goalBox: {
    backgroundColor: "#222",
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 3,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 18,
    fontFamily: "outfit-medium",
    color: "#FFF",
  },
  selectedGoal: {
    borderColor: "#D4FF00", // Neon border for selection
    transform: [{ scale: 1.05 }],
  },
  selectedText: {
    color: "#D4FF00",
  },
  nextButton: {
    backgroundColor: "#D4FF00",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  nextButtonText: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: "black",
  },
  disabledButton: {
    backgroundColor: "#555",
  },
});
