import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

const Gender = () => {
  const [selectedGender, setSelectedGender] = useState(null);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tell us About Yourself</Text>
      <Text style={styles.subtitle}>
        To provide you with a better experience, we’d love to know your gender.
      </Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.option,
            selectedGender === "female" && styles.selectedOption,
          ]}
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
          <Text
            style={[
              styles.optionText,
              selectedGender === "female" && styles.selectedText,
            ]}
          >
            Female
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            styles.maleOption,
            selectedGender === "male" && styles.selectedOption,
          ]}
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
          <Text
            style={[
              styles.optionText,
              styles.maleText,
              selectedGender === "male" && styles.selectedText,
            ]}
          >
            Male
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={() => router.push("/forms/Option1")}>
        <Text style={styles.nextButtonText}>Next ›</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FD", // Light gradient background
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20, // Adds spacing between buttons
  },
  option: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    marginVertical: 10,
    elevation: 5, // Android shadow
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    transition: "0.3s ease-in-out",
  },
  selectedOption: {
    borderWidth: 3,
    borderColor: "#FFD700", // Gold border for selection
    transform: [{ scale: 1.1 }],
  },
  maleOption: {
    backgroundColor: "#0057D9",
  },
  iconContainer: {
    marginBottom: 8,
  },
  optionText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  selectedText: {
    color: "#FFD700",
  },
  maleText: {
    color: "#F7F9FC",
  },
  nextButton: {
    marginTop: 25,
    backgroundColor: "#FF8C42",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5, // Android shadow
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  nextButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default Gender;
