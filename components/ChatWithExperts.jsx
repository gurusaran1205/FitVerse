import React from "react";
import { View, Text, Button, Alert, TouchableOpacity } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "expo-router";

const ChatWithExperts = () => {
  const router = useRouter();
  // Get Firebase Auth instance

  const handleLogout = async () => {
    router.push("/forms/Chatbot")
  };

  return (
    <View>
      <TouchableOpacity onPress={handleLogout}style={{
        marginTop:15,
        paddingVertical:10,
        paddingHorizontal: 30,
        backgroundColor:'black',
        borderRadius:12,
        borderWidth: 3,
        borderColor:'white',
        shadowColor:'white',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
        

      }}>
        <Text style={{
          color:'white',
          fontSize: 18,
          fontFamily:'outfit-bold',
          textAlign:'center'
        }}>Chat With Arogya</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatWithExperts;
