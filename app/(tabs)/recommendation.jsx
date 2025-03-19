import { View, Text, Alert, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../configs/FirebaseConfigs';
import Markdown from 'react-native-markdown-display';
import { router } from 'expo-router';

const genAI = new GoogleGenerativeAI('AIzaSyBvHAM4fhg9Mfmx0QGD6Wvrlo9oQkW9Stw'); // Secure your API key

const Recommendation = () => {
  const [vitals, setVitals] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          Alert.alert('You are not logged in');
          return;
        }
        const vitalsDoc = await getDoc(doc(db, 'Vitals', userId));
        if (vitalsDoc.exists()) {
          setVitals(vitalsDoc.data());
        } else {
          Alert.alert('No Vitals Found');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error Loading data');
      }
    };
    fetchVitals();
  }, []);

  const getSuggestions = async () => {
    if (!vitals) {
      Alert.alert('Vitals are not available');
      return;
    }

    setLoading(true);

    const prompt = `
      I have the following health vitals:
      - Age: ${vitals.age}
      - Height: ${vitals.height} cm
      - Weight: ${vitals.weight} kg
      - BMI: ${vitals.bmi}
      - Blood Pressure: ${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}
      - Heart Rate: ${vitals.heartRate} bpm

      Based on this, suggest three different health plans with just their **titles** in three budget categories: low, medium, and high.
      Each title should be unique and creative to reflect the type of plan, for example:  
      - A beginner-friendly plan for low-budget users 💪🛶  
      - A balanced plan for medium-budget users 🏃🥗  
      - A premium, intensive plan for high-budget users 🔥🏆  

      Format your response as:
      **Plan 1 - Starter Boost 💡 (Low Budget)**
      **Plan 2 - Balanced Wellness ⚖️ (Medium Budget)**
      **Plan 3 - Elite Performance 🚀 (High Budget)**

    `;

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const result = await model.generateContent(prompt);

      if (!result || !result.response) {
        Alert.alert('Error: No response received from AI');
        setLoading(false);
        return;
      }

      const response = result.response.text();
      if (!response) {
        Alert.alert('Error: Response is empty');
        setLoading(false);
        return;
      }

      // Extracting only the plan titles
      const plans = response.split('**').filter((plan) => plan.includes('Plan')).map((plan) => plan.trim());

      setRecommendations(plans);
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to get AI Suggestions, Try Again Later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Health, Our Plan</Text>

      <TouchableOpacity style={styles.button} onPress={getSuggestions} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Generating Plans...' : 'Get Diet & Exercise Plans'}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#D4FF00" style={styles.loader} />}

      {recommendations.map((title, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.planCard}
          onPress={() => router.push({
            pathname: '/forms/PlanDetails',
            params: { title }, // Send only the title
          })}
        >
          <Markdown style={markdownStyles}>{title}</Markdown>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Recommendation;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', padding: 20 },
  title: { fontSize: 24, fontFamily: 'outfit-bold', color: '#D4FF00', textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#D4FF00', padding: 15, borderRadius: 20, alignItems: 'center', marginBottom: 15 },
  buttonText: { fontSize: 18, fontFamily: 'outfit-bold', color: 'black' },
  loader: { marginTop: 10 },
  planCard: { backgroundColor: '#222', padding: 15, borderRadius: 10, marginTop: 10 },
});

const markdownStyles = { body: { color: 'white', fontSize: 16, fontFamily: 'outfit-medium' } };
