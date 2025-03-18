import { View, Text, Alert, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../configs/FirebaseConfigs';
import Markdown from 'react-native-markdown-display';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

const genAI = new GoogleGenerativeAI('AIzaSyBvHAM4fhg9Mfmx0QGD6Wvrlo9oQkW9Stw'); // Secure your API key

const Recommendation = () => {
  const [vitals, setVitals] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleNavigate = (planTitle, planDetails) => {
    router.push({
      pathname: '/forms/PlanDetails',
      params: { 
        title: planTitle,
        details: encodeURIComponent(planDetails), 
      }, // Convert plan to string
    });
    console.log("Details of:",planDetails)
    
    
  }

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

      Based on this, suggest a **healthy diet plan** and a **daily exercise routine** for me in three budget categories: low, medium, and high.
      Format your response as:
      **Plan 1 (Low Budget)**
      Diet: ...
      Exercise: ...

      **Plan 2 (Medium Budget)**
      Diet: ...
      Exercise: ...

      **Plan 3 (High Budget)**
      Diet: ...
      Exercise: ...
    `;

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const result = await model.generateContent(prompt);
      // Check if the response exists before calling .text()
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

      // Split response into an array of plans
      const plans = response.split('**').filter((plan) => plan.includes('Plan'));
      const formattedPlans = plans.map((plan) => {
        const [title, ...details] = plan.split('\n');
        return { title: title.trim(), details: details.join('\n').trim() };
      });

      setRecommendations(formattedPlans);
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
        <Text style={styles.buttonText}>{loading ? 'Generating Plan...' : 'Get Diet & Exercise Plan'}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#D4FF00" style={styles.loader} />}

      {recommendations.map((plan, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.planCard}
          onPress={() => handleNavigate(plan.title, plan.details)}
        >
          <Markdown style={markdownStyles}>{plan.title}</Markdown>
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
  planCard: { backgroundColor: '#222', padding: 15, borderRadius: 10, marginTop: 10, color:'white' },
});

const markdownStyles = { body: { color: 'white', fontSize: 16, fontFamily: 'outfit-medium' } };
