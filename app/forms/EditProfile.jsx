import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { auth, db } from '../../configs/FirebaseConfigs';
import { doc, setDoc } from 'firebase/firestore';

const ProfileUpdate = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('170');
  const [bmi, setBmi] = useState('24.22');
  const [age, setAge] = useState('20');
  const [heartRate, setHeartRate] = useState('72');
  const [bloodPressure, setBloodPressure] = useState('122/80');

  // Function to pick an image
  const pickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  // Function to update profile in Firebase
  const updateProfile = async () => {
    try {
      const user = auth.currentUser; // Get logged-in user
      if (!user) {
        alert("User not logged in!");
        return;
      }

      const userDoc = doc(db, "users", user.uid); // Reference to Firestore document

      // Data to save
      const profileData = {
        weight,
        height,
        bmi,
        age,
        heartRate,
        bloodPressure,
        profileImage: profileImage || null, // Save image URI if selected
        updatedAt: new Date().toISOString(),
      };

      // Save data to Firestore
      await setDoc(userDoc, profileData, { merge: true });

      alert("Profile Updated Successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={profileImage ? { uri: profileImage } : require('../../assets/images/login1.png')}
          style={styles.profileImage}
        />
        <View style={styles.profileDetails}>
          <Text style={styles.name}>Akshaya</Text>
          <Text style={styles.bio}>Passionate about fitness and a healthy lifestyle.</Text>
        </View>
        <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputBoxContainer}>
        {[['Weight (kg)', weight, setWeight], ['Height (cm)', height, setHeight],
          ['BMI', bmi, setBmi], ['Age', age, setAge],
          ['Heart Rate', heartRate, setHeartRate], ['Blood Pressure', bloodPressure, setBloodPressure]]
          .map(([label, value, setValue], index) => (
            <View key={index} style={styles.inputBox}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={value}
                onChangeText={setValue}
              />
            </View>
          ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={updateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'black',
    padding: 20,
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#D4FF00',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#D4FF00',
  },
  profileDetails: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    color: '#D4FF00',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bio: {
    color: 'gray',
    fontSize: 14,
  },
  changePhotoButton: {
    backgroundColor: '#D4FF00',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  changePhotoText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputBoxContainer: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inputBox: {
    backgroundColor: '#D4FF00',
    width: '48%',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4FF00',
  },
  label: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
  },
  input: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#D4FF00',
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default ProfileUpdate;
