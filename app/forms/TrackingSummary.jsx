import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../configs/FirebaseConfigs";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";

export default function TrackingSummary() {
  const { distance, calories } = useLocalSearchParams();

  useEffect(() => {
    saveTrackingData();
  }, []);

  // Save tracking data to Firebase
  const saveTrackingData = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert("Error", "You are not logged in!");
        return;
      }

      const trackingRef = collection(db, "TrackingData", userId, "sessions");
      await addDoc(trackingRef, {
        distance: parseFloat(distance),
        calories: parseFloat(calories),
        timestamp: new Date(),
      });

      console.log("Tracking data saved successfully!");
    } catch (error) {
      console.error("Error saving tracking data:", error);
      Alert.alert("Error", "Failed to save tracking data.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/fitness/GpsTracker")}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Tracking Summary</Text>

      {/* Summary Display */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>Distance Covered</Text>
        <Text style={styles.value}>{distance} km</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>Calories Burned</Text>
        <Text style={styles.value}>{calories} kcal</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.doneButton} onPress={() => router.push("/mydiet")}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Track Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black", padding: 20, justifyContent: "center", alignItems: "center" },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 50,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#D4FF00", marginBottom: 20 },
  summaryCard: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginBottom: 15,
  },
  summaryText: { fontSize: 18, color: "#D4FF00" },
  value: { fontSize: 22, fontWeight: "bold", color: "white", marginTop: 5 },
  buttonContainer: { flexDirection: "row", gap: 15, marginTop: 20 },
  doneButton: { backgroundColor: "#D4FF00", padding: 15, borderRadius: 10 },
  retryButton: { backgroundColor: "gray", padding: 15, borderRadius: 10 },
  buttonText: { fontSize: 16, fontWeight: "bold", color: "black" },
});

