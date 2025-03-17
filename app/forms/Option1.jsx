import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router'; // Navigation
import { auth, db } from '../../configs/FirebaseConfigs';
import { collection, addDoc } from 'firebase/firestore';

const Option1 = () => {
  const [selectedGoal, setSelectedGoal] = useState(null); // Track selected option
  const router = useRouter(); // Navigation handler

  const goals = [
    { id: 'lose', title: 'Lose weight', image: 'https://via.placeholder.com/150' },
    { id: 'gain', title: 'Gain weight', image: 'https://via.placeholder.com/150' },
    { id: 'healthy', title: 'Stay healthy', image: 'https://via.placeholder.com/150' }
  ];

  // Function to save data to Firebase and navigate
  const handleNext = async () => {
    if (selectedGoal) {
      try {
        await addDoc(collection(db, 'userGoals'), {
          goal: selectedGoal,
          timestamp: new Date(),
        });
        router.replace('/forms/Vitals'); // Navigate to the next page
      } catch (error) {
        console.error('Error saving goal:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          What is your <Text style={styles.highlight}>goal?</Text>
        </Text>
        <Text style={styles.headerSubtitle}>
          We will use this data to give you a better diet type for you
        </Text>
      </View>

      {/* Goals Section */}
      <View style={styles.goalContainer}>
        {goals.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.goalBox,
              selectedGoal === goal.id && styles.selectedGoal // Highlight if selected
            ]}
            onPress={() => setSelectedGoal(goal.id)}
          >
            <Image source={{ uri: goal.image }} style={styles.image} />
            <View style={styles.optionContainer}>
              <Text
                style={[
                  styles.optionText,
                  selectedGoal === goal.id && styles.selectedText // Highlight text if selected
                ]}
              >
                {goal.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={[styles.nextButton, !selectedGoal && styles.disabledButton]}
        onPress={handleNext}
        disabled={!selectedGoal} // Disable if no option is selected
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Option1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  highlight: {
    color: '#27AE60', // Green color for "goal?"
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    marginTop: 8,
  },
  goalContainer: {
    marginTop: 20,
  },
  goalBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3, // Adds a slight shadow effect
  },
  image: {
    width: '100%',
    height: 150, // Adjust the image size
  },
  optionContainer: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  selectedGoal: {
    backgroundColor: '#E8F5E9', // Light green for selected goal
    borderColor: '#27AE60',
    borderWidth: 2, // Adds a border to highlight selection
  },
  selectedText: {
    color: '#27AE60',
  },
  nextButton: {
    backgroundColor: '#27AE60',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD', // Gray when disabled
  },
});
