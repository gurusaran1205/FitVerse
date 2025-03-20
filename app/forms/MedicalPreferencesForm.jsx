import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { auth, db } from "../../configs/FirebaseConfigs";
import { setDoc, doc } from "firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";
import {router} from 'expo-router';

const MedicalPreferencesForm = () => {
  const [hasCycle, setHasCycle] = useState(false);
  const [lastCycle, setLastCycle] = useState("");
  const [cycleLength, setCycleLength] = useState("");
  const [allergies, setAllergies] = useState([""]);
  const [surgeries, setSurgeries] = useState([""]);
  const [otherMedical, setOtherMedical] = useState("");

  // Add input field dynamically
  const addField = (type) => {
    if (type === "allergies") {
      setAllergies([...allergies, ""]);
    } else {
      setSurgeries([...surgeries, ""]);
    }
  };

  // Update field dynamically
  const updateField = (text, index, type) => {
    const updated = type === "allergies" ? [...allergies] : [...surgeries];
    updated[index] = text;
    type === "allergies" ? setAllergies(updated) : setSurgeries(updated);
  };

  // Remove a field
  const removeField = (index, type) => {
    const updated =
      type === "allergies"
        ? allergies.filter((_, i) => i !== index)
        : surgeries.filter((_, i) => i !== index);
    type === "allergies" ? setAllergies(updated) : setSurgeries(updated);
  };

  // Submit Form Data to Firebase
  const handleSubmit = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert("Error", "You must be logged in to save your medical details.");
      return;
    }

    const data = {
      hasCycle,
      lastCycle: hasCycle ? lastCycle : "N/A",
      cycleLength: hasCycle ? cycleLength : "N/A",
      allergies: allergies.filter((a) => a.trim() !== ""),
      surgeries: surgeries.filter((s) => s.trim() !== ""),
      otherMedical,
    };

    try {
      await setDoc(doc(db, "MedicalPreferences", userId), data);
      Alert.alert("Success", "Your medical details have been saved.");
      router.push("/forms/Option1");

    } catch (error) {
      console.error("Error saving medical data:", error);
      Alert.alert("Error", "Failed to save data. Please try again.");
    }
  };

  // Skip button handler
  const handleSkip = () => {
    Alert.alert("Skipped", "You skipped this form.");
    router.push("/forms/Option1");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Page Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Medical Preferences</Text>
        <Ionicons name="medkit-outline" size={28} color="#D4FF00" />
      </View>

      {/* Menstrual Cycle Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menstrual Cycle (if applicable)</Text>
        <View style={styles.switchRow}>
          <Text style={styles.sectionTitle1}>Track menstrual cycle</Text>
          <Text style={styles.sectionTitle1}>To Enter details, Please turn the switch on!</Text>

          <Switch
            value={hasCycle}
            onValueChange={setHasCycle}
            trackColor={{ false: "#767577", true: "#D4FF00" }}
            thumbColor={hasCycle ? "#D4FF00" : "#fff"}
          />
        </View>
        {hasCycle && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Last Cycle Date (YYYY-MM-DD)"
              placeholderTextColor="#888"
              value={lastCycle}
              onChangeText={setLastCycle}
            />
            <TextInput
              style={styles.input}
              placeholder="Average cycle length (days)"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={cycleLength}
              onChangeText={setCycleLength}
            />
          </>
        )}
      </View>

      {/* Medical History Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical History</Text>

        {/* Allergies Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Allergies</Text>
          {allergies.map((allergy, index) => (
            <View key={`allergy-${index}`} style={styles.dynamicFieldContainer}>
              <TextInput
                style={[styles.input, styles.flexInput]}
                placeholder="Enter allergy"
                placeholderTextColor="#888"
                value={allergy}
                onChangeText={(text) => updateField(text, index, "allergies")}
              />
              {allergies.length > 1 && (
                <TouchableOpacity onPress={() => removeField(index, "allergies")}>
                  <Text style={styles.removeButton}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={() => addField("allergies")}>
            <Text style={styles.addButtonText}>+ Add Allergy</Text>
          </TouchableOpacity>
        </View>

        {/* Surgeries Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Surgeries</Text>
          {surgeries.map((surgery, index) => (
            <View key={`surgery-${index}`} style={styles.dynamicFieldContainer}>
              <TextInput
                style={[styles.input, styles.flexInput]}
                placeholder="Enter surgery"
                placeholderTextColor="#888"
                value={surgery}
                onChangeText={(text) => updateField(text, index, "surgeries")}
              />
              {surgeries.length > 1 && (
                <TouchableOpacity onPress={() => removeField(index, "surgeries")}>
                  <Text style={styles.removeButton}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={() => addField("surgeries")}>
            <Text style={styles.addButtonText}>+ Add Surgery</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Other Medical Specifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other Medical Information</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Any other medical information..."
          placeholderTextColor="#888"
          multiline
          maxLength={500}
          value={otherMedical}
          onChangeText={setOtherMedical}
        />
      </View>

      {/* Buttons in a Row */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.btn, styles.skipBtn]} onPress={handleSkip}>
          <Text style={styles.btnText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.submitBtn]} onPress={handleSubmit}>
          <Text style={styles.btnText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "black" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: "#D4FF00", fontSize: 24, fontFamily: "outfit-bold" },
  section: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: "#444", paddingBottom: 10 },
  sectionTitle: { color: "#D4FF00", fontSize: 18, fontFamily: "outfit-medium", marginBottom:10 },
  sectionTitle1: { color: "white", fontSize: 18, fontFamily: "outfit-medium", marginBottom:10 },
  input: { backgroundColor: "#222", color: "#fff", padding: 12, borderRadius: 6, marginBottom: 10 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", gap: 10, marginTop: 30 },
  btn: { flex: 1, padding: 12, borderRadius: 6, alignItems: "center" },
  skipBtn: { backgroundColor: "#555" },
  submitBtn: { backgroundColor: "#D4FF00" },
  btnText: { fontSize: 16, fontFamily: "outfit-bold", color: "black" },
});

export default MedicalPreferencesForm;
