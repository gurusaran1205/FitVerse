import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from 'expo-router'
import {Colors} from '../../../app-example/constants/Colors'
import { useEffect } from 'react'
import { TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from './../../../configs/FirebaseConfigs'




export default function ForgotPassword() {
  const router = useRouter();

  const [email,setEmail] = useState("");
  
  useEffect(() => {
    router.setParams({
      headerShown: false,
    });
  }, []);

  const handleForgot = () => {
    if(!email){
      ToastAndroid.show('Please Enter every details',ToastAndroid.SHORT)
      return;
    }


  sendPasswordResetEmail(auth, email)
    .then(() => {
      Alert.alert("Email Sent,Please check your email for a link to reset password")
      router.replace('/auth/sign-in');
    })
    .catch((error) => {
      ToastAndroid.show('Reset failed, please try again!', ToastAndroid.LONG);
    });
  }

  return (
    <View style={{
      padding:25,
      paddingTop:40,
      backgroundColor:'white',
      height:'100%',
      marginBottom:10
    }}>
      <TouchableOpacity onPress={() => router.back()}>
      <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
      </TouchableOpacity>
      
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:30,
        marginTop:10
      }}>Forgot Your Password??</Text>
      <Text style={{
        fontFamily:'outfit',
        fontSize:30,
        color:'gray',
        marginTop:10
      }}>Reset it here</Text>
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:30,
        color:'gray',
        marginTop:10
      }}>You've Been Missed ..</Text>


      {/*Email */}
      <View style={{
        marginTop:20
      }}>
        <Text style={{
          fontFamily:'outfit'
        }}>Email</Text>
        <TextInput value={email} style={styles.holder} onChangeText={(value) => setEmail(value)} placeholder='Enter Email'/>
      </View>

      {/*Sign In */}

      <TouchableOpacity onPress={handleForgot} style={{
        padding:20,
        marginTop:40,
        backgroundColor:'black',
        borderRadius:15

      }}>
        <Text style={{
          color:'white',
          fontFamily:'outfit-bold',
          textAlign:'center'
        }}>Submit</Text>
      </TouchableOpacity>

      {/*Sign Up */}


      <TouchableOpacity 
      onPress={() => router.replace('/auth/sign-in')}
      style={{
        padding:20,
        marginTop:30,
        backgroundColor:'white',
        borderRadius:15,
        borderWidth:1,

      }}>
        <Text style={{
          color:'black',
          fontFamily:'outfit-bold',
          textAlign:'center'
        }}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  holder:{
    padding:20,
    borderWidth:1,
    borderRadius:15,
    borderColor:'gray',
    fontFamily:'outfit'

  }

})