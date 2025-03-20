import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Svg, { Path } from "react-native-svg";
import { auth, db } from "../../configs/FirebaseConfigs";
import { setDoc, doc } from "firebase/firestore";

const Gender = () => {
  const [selectedGender, setSelectedGender] = useState(null);
  const router = useRouter();

  // Function to handle Next button
  const handleNext = async () => {
    if (!selectedGender) {
      Alert.alert("Selection Required", "Please select a gender before proceeding.");
      return;
    }

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert("Error", "You must be logged in.");
        return;
      }

      await setDoc(doc(db, "Users", userId), { gender: selectedGender }, { merge: true });

      router.push("/forms/Vitals");
    } catch (error) {
      console.error("Error saving gender:", error);
      Alert.alert("Error", "Failed to save gender. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Tell Us About Yourself</Text>
      <Text style={styles.subtitle}>
        To provide you with a better experience, we’d love to know your gender.
      </Text>

      {/* Gender Selection */}
      <View style={styles.optionsContainer}>
        {/* Female Option */}
        <TouchableOpacity
          style={[styles.option, selectedGender === "female" && styles.selectedOption]}
          onPress={() => setSelectedGender("female")}
        >
          <View style={styles.iconContainer}>
            <Svg width="50" height="50" viewBox="0 0 24 24">
              <Path
                d="M12 4a5 5 0 0 1 1 9.9V16h2v2h-2v2h-2v-2H9v-2h2v-2.1A5 5 0 0 1 12 4zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
                fill={selectedGender === "female" ? "#FF69B4" : "#fff"}
              />
            </Svg>
          </View>
          <Text style={[styles.optionText, selectedGender === "female" && styles.selectedText]}>
            Female
          </Text>
        </TouchableOpacity>

        {/* Male Option */}
        <TouchableOpacity
          style={[styles.option, styles.maleOption, selectedGender === "male" && styles.selectedOption]}
          onPress={() => setSelectedGender("male")}
        >
          <View style={styles.iconContainer}>
            <Svg width="50" height="50" viewBox="0 0 24 24">
              <Path
                d="M16 2h6v6h-2V4.4L14.4 10A5 5 0 1 1 12 4a5 5 0 0 1 3.6 1.6L20 2zM12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
                fill={selectedGender === "male" ? "#007BFF" : "#fff"}
              />
            </Svg>
          </View>
          <Text style={[styles.optionText, selectedGender === "male" && styles.selectedText]}>
            Male
          </Text>
        </TouchableOpacity>
      </View>

      {/* Next Button */}
      <TouchableOpacity style={[styles.nextButton, !selectedGender && styles.disabledButton]} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next ›</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black", // Dark background for theme
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: "outfit-bold",
    color: "#D4FF00", // Neon green theme color
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  option: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222", // Dark gray for non-selected buttons
    marginVertical: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    transition: "0.3s ease-in-out",
  },
  selectedOption: {
    borderWidth: 3,
    borderColor: "#FFD700", // Gold border for selection
    transform: [{ scale: 1.1 }], // Smooth scaling animation
  },
  maleOption: {
    backgroundColor: "#0057D9", // Blue for male selection
  },
  iconContainer: {
    marginBottom: 8,
  },
  optionText: {
    color: "white",
    fontFamily: "outfit-medium",
    fontSize: 16,
  },
  selectedText: {
    color: "#FFD700", // Gold text for selected gender
  },
  nextButton: {
    marginTop: 25,
    backgroundColor: "#D4FF00", // Neon green button
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  disabledButton: {
    opacity: 0.5, // Disable effect if no gender selected
  },
  nextButtonText: {
    color: "black",
    fontFamily: "outfit-bold",
    fontSize: 18,
  },
});

export default Gender;
