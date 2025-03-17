import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { auth, db } from '../../configs/FirebaseConfigs';
import { doc, setDoc } from 'firebase/firestore';
import Markdown from 'react-native-markdown-renderer';

const PlanDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { plan } = route.params;

  const savePlan = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('You are not logged in');
        return;
      }

      await setDoc(doc(db, 'SelectedPlan', userId), { plan, date: new Date() });
      Alert.alert('Plan Saved', 'Your selected plan has been stored successfully.');
      navigation.replace('GoalTracking');
    } catch (error) {
      console.error(error);
      Alert.alert('Error saving plan');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Selected Plan</Text>
      <View style={styles.planCard}>
        <Markdown style={markdownStyles}>{plan}</Markdown>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.yesButton} onPress={savePlan}>
          <Text style={styles.buttonText}>Yes, Save Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.noButton} onPress={() => navigation.goBack()}>
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
});

const markdownStyles = { body: { color: 'white', fontSize: 16, fontFamily: 'outfit-medium' } };
