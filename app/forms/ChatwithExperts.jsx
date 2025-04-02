import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app, db } from '../../configs/FirebaseConfigs'; // Ensure firebase is initialized


export default function ChatWithExperts() {
  const router = useRouter();
  const [name, setName] = useState('');  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [doctor, setDoctor] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !phone || !doctor || !symptoms) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'chats'), {
        name,
        email,
        phone,
        doctor,
        symptoms,
        timestamp: new Date(),
      });
      setSubmitted(true);
      Alert.alert('Success', 'Your request has been submitted!');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      
      <Text style={styles.heading}>Chat with Experts</Text>

      <TextInput style={styles.input} placeholder="Your Name" placeholderTextColor="white" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Your Email" placeholderTextColor="white" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Your Phone Number" placeholderTextColor="white" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

      <Picker selectedValue={doctor} onValueChange={setDoctor} style={styles.picker}>
        <Picker.Item label="Select a Doctor" value="" />
        <Picker.Item label="Dr. John Doe" value="Dr. John Doe" />
        <Picker.Item label="Dr. Jane Smith" value="Dr. Jane Smith" />
      </Picker>

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe your symptoms"
        multiline
        placeholderTextColor="white"
        value={symptoms}
        onChangeText={setSymptoms}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit</Text>}
      </TouchableOpacity>

      {submitted && (
        <View style={styles.confirmationBox}>
          <Text style={styles.confirmationText}>✅ Your query is duly noted. The corresponding doctor will reach out ASAP.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#121212',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 10,
    backgroundColor: '#D4FF00',
    padding: 10,
    borderRadius: 50,
  },
  heading: {
    fontSize: 28,
    fontFamily:'outfit-bold',
    textAlign: 'center',
    color: '#D4FF00',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    color: 'white',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    fontFamily:'outfit-medium',
    borderWidth: 1,
    borderColor: '#D4FF00',
  },
  picker: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    color: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D4FF00',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#D4FF00',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    width: '100%',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontFamily:'outfit-bold',
  },
  confirmationBox: {
    backgroundColor: '#1B5E20',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  confirmationText: {
    color: '#fff',
    fontSize: 16,
    fontFamily:'outfit-bold',
    textAlign: 'center',
  },
});
