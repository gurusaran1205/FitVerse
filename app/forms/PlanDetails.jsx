import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { auth, db } from '../../configs/FirebaseConfigs';
import { doc, setDoc } from 'firebase/firestore';
import Markdown from 'react-native-markdown-display';
import { useLocalSearchParams, router } from 'expo-router';


const PlanDetails = () => {
  const { title, details } = useLocalSearchParams();
  console.log("Raw details received:", details);
  const decodedDetails = details ? decodeURIComponent(details).toString().replace(/\\n/g, '\n') : "No details available."
  console.log("Decoded Details:", decodedDetails);
  const [loading, setLoading] = useState(false);

  console.log("Decoded Details:", decodedDetails);

  const savePlan = async () => {
    if (!auth.currentUser?.uid){
      Alert.alert('Error','You are not logged in!!');
      return;
    }


    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      await setDoc(doc(db, 'SelectedPlan', userId), { plan:parsedPlan, date: new Date() });
      Alert.alert('Plan Saved', 'Your selected plan has been stored successfully.');
      router.replace('/Fitness');
    } catch (error) {
      console.error(error);
      Alert.alert('Error saving plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.planCard}>
      {decodedDetails && decodedDetails.trim() !== "" ? (
        <Markdown style={markdownStyles}>{decodedDetails}</Markdown>
      ) : (
        <Text style={{ color: "white" }}>No details available.</Text>
      )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.yesButton, loading && styles.disabledButton]} 
          onPress={savePlan}
          disabled = {loading}
          >
          <Text style={styles.buttonText}>{loading? 'Saving...' : 'Yes, Save Plan' }</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.noButton} 
          onPress={() => router.back()}>
          <Text style={styles.buttonText}>No, Choose Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlanDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontFamily: 'outfit-bold', color: '#D4FF00', marginBottom: 20 },
  planCard: { backgroundColor: '#222', padding: 15, borderRadius: 10, marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  yesButton: { backgroundColor: '#D4FF00', padding: 15, borderRadius: 10, flex: 1, marginRight: 10 },
  noButton: { backgroundColor: 'gray', padding: 15, borderRadius: 10, flex: 1 },
  buttonText: { textAlign: 'center', fontSize: 18, fontFamily: 'outfit-bold', color: 'black' },
  disabledButton: {backgroundColor:'#999'},
});

const markdownStyles = { body: { color: 'white', fontSize: 16, fontFamily: 'outfit-medium' } };
