import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from 'expo-router'
import {Colors} from '../../../app-example/constants/Colors'
import { useEffect } from 'react'
import { TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from './../../../configs/FirebaseConfigs'




export default function signIn() {
  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  useEffect(() => {
    router.setParams({
      headerShown: false,
    });
  }, []);

  const onSignIn=()=>{
    if(!email || !password){
      ToastAndroid.show('Please Enter every details',ToastAndroid.BOTTOM)
      return;
    }


  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user);
      router.replace('/mydiet');
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode,errorMessage);
      const errorMessages = {
        'auth/invalid-credential': 'Invalid Credentials',
        'auth/user-not-found': 'User not found, please sign up first!',
        'auth/wrong-password': 'Incorrect password, please try again!',
        'auth/network-request-failed': 'Network error, check your connection!',
      };
      
      ToastAndroid.show(errorMessages[errorCode] || 'Login failed, please try again!', ToastAndroid.LONG);
    });
  }

  return (
    <ImageBackground 
      source={require('../../../assets/images/back2.jpeg')}
      style={styles.background}
      imageStyle={{opacity:1}}
    
    >
    <View style={{
      padding:25,
      paddingTop:30,
      height:'100%',
      marginBottom:10
    }}>
      <TouchableOpacity onPress={() => router.back()}>
      <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
      </TouchableOpacity>
      
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:30,
        marginTop:10,
        color:'#D4FF00'
      }}>Let's Sign You In</Text>
      <Text style={{
        fontFamily:'outfit',
        fontSize:30,
        color:'white',
        marginTop:10
      }}>Welcome Back</Text>
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:30,
        color:'white',
        marginTop:10
      }}>You've Been Missed ..</Text>


      {/*Email */}
      <View style={{
        marginTop:20,
        paddingTop:30
      
      }}>
        <Text style={{
          fontFamily:'outfit-medium',
          fontSize:17,
          color:'#D4FF00'
        }}>Email</Text>
        <TextInput value={email} style={styles.holder} onChangeText={(value) => setEmail(value)} placeholder='Enter Email' placeholderTextColor={'white'}/>
      </View>


      {/*Password */}
      <View style={{
        marginTop:20
      }}>
        <Text style={{
          fontFamily:'outfit-medium',
          fontSize:17,
          color:'#D4FF00'
        }}>Password</Text>
        <TextInput secureTextEntry={true} style={styles.holder} onChangeText={(value) => setPassword(value)} placeholder='Enter Your Password' placeholderTextColor={'white'}/>
      </View>

      {/*Sign In */}

      <TouchableOpacity onPress={onSignIn} style={{
        padding:20,
        marginTop:40,
        backgroundColor:'#D4FF00',
        borderRadius:15

      }}>
        <Text style={{
          color:'black',
          fontFamily:'outfit-bold',
          textAlign:'center'
        }}>SignIn</Text>
      </TouchableOpacity>

      {/*Sign Up */}


      <TouchableOpacity 
      onPress={() => router.replace('/auth/sign-out')}
      style={{
        padding:20,
        marginTop:30,
        backgroundColor:'black',
        borderRadius:15,
        borderWidth:1,
        borderColor:'#D4FF00'

      }}>
        <Text style={{
          color:'#D4FF00',
          fontFamily:'outfit-bold',
          textAlign:'center',
          
        }}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      onPress={() => router.replace('/auth/forgot')}>
        <Text 
        style ={{
        color:'#D4FF00',
        padding:20,
        fontFamily:'outfit-bold',
        }}> 
      Forgot Password ? </Text>
      </TouchableOpacity>


    </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  holder:{
    padding:20,
    borderWidth:1,
    borderRadius:15,
    borderColor:'white',
    fontFamily:'outfit',
    color:'#D4FF00'

  },
  background:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }

})