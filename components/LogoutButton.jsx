import React from "react";
import { View, Text, Button, Alert, TouchableOpacity } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "expo-router";

const LogoutButton = () => {
  const router = useRouter();
  const auth = getAuth(); // Get Firebase Auth instance

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logged Out", "You have been signed out successfully.");
      router.replace("/auth/sign-in"); // Redirect to sign-in page
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleLogout}style={{
        padding:20,
        marginTop:40,
        backgroundColor:'black',
        borderRadius:15

      }}>
        <Text style={{
          color:'white',
          fontFamily:'outfit-bold',
          textAlign:'center'
        }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LogoutButton;
