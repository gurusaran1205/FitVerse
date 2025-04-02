import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Markdown from 'react-native-markdown-display';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import {app} from '../../configs/FirebaseConfigs';


const genAI = new GoogleGenerativeAI('AIzaSyBvHAM4fhg9Mfmx0QGD6Wvrlo9oQkW9Stw');

const PlanDetails = () => {
  const { title } = useLocalSearchParams();
  const [planDetails, setPlanDetails] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const db = getFirestore(app);

  const fetchPlanDetails = async () => {
    if (!title) {
      Alert.alert('Error', 'No plan title provided');
      return;
    }

    setLoading(true);
    const prompt = `Give a small explanation for the following health plan: ${title}. Include a daily tasks to do with respect to the plan which has sleep duration, water intake, aerobic activities, calories burnt.`;

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

      setPlanDetails(response);
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to get plan details, Try Again Later');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanDetails();
  }, [title]);

  const savePlanToFirebase = async () => {
    try {
      await addDoc(collection(db, 'userPlans'), {
        title,
        details: planDetails,
        createdAt: new Date(),
      });
      Alert.alert('Success', 'Plan saved successfully!');
      router.replace('/(tabs)/profile');
    } catch (error) {
      console.error('Error saving plan:', error);
      Alert.alert('Error', 'Failed to save plan');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#D4FF00" />
        ) : (
          <Markdown style={markdownStyles}>{planDetails}</Markdown>
        )}
      </ScrollView>

      {/* Sticky Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={savePlanToFirebase}>
          <Text style={styles.buttonText}>✅ Yes, Save Plan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.noButton]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>❌ No, Go Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.regenerateButton]} onPress={fetchPlanDetails}>
          <Text style={styles.buttonText}>🔄 Regenerate Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlanDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  content: { flex: 1, padding: 20, marginBottom: 80 }, // Prevent content from hiding behind buttons
  title: { fontSize: 22, fontFamily: 'outfit-bold', color: '#D4FF00', textAlign: 'center', marginBottom: 20 },

  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'black',
    paddingVertical: 10,
    borderRadius: 15,
  },

  button: {
    flex: 1,
    padding: 15,
    backgroundColor: '#D4FF00',
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  noButton: { backgroundColor: '#FF3B30' },
  regenerateButton: { backgroundColor: '#007AFF' },

  buttonText: { fontSize: 16, fontFamily: 'outfit-medium', color: 'black' },
});

const markdownStyles = { body: { color: 'white', fontSize: 16, fontFamily: 'outfit-medium' } };
