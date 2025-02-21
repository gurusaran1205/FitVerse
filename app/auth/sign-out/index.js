import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { TextInput } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {auth} from './../../../configs/FirebaseConfigs'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
export default function signUp() {
  const navigation = useNavigation();
  const router = useRouter();

  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const [fullName,setFullName] = useState();

  useEffect(() => {
    navigation.setOptions({
      headerShown:false
    })
  },[]);

  const OnCreateAccount = () => {
    if(!email && !password && !fullName){
      ToastAndroid.show('Please Enter All Details,',ToastAndroid.BOTTOM)
      return ;
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      sendEmailVerification(user).then(() => {
        console.log(user);
        ToastAndroid.show('User Account Created',ToastAndroid.BOTTOM)
        router.replace('/mydiet');

      }).catch(e => {
        Alert.alert("Email could not be verified!")
        console.error(e)
      })
      
      
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage,errorCode)
      // ..
    });
  }

  return (
    <View style={{
      padding:25,
      paddingTop:50,
      backgroundColor:'white',
      height:'100%'
    }}>
      <TouchableOpacity onPress={() => router.back()}>
        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
      </TouchableOpacity>

      <Text style={{
        fontSize:30,
        fontFamily:'outfit-bold'
      }}>Create New Account</Text>


      {/*Name */}
      <View style={{
        marginTop:20
      }}>
        <Text style={{
          fontFamily:'outfit'
        }}>Full Name</Text>
        <TextInput style={styles.holder} placeholder='Enter Full Name'
         onChangeText={(value)=>setFullName(value)} 
        />
      </View>

      {/*Email */}
      <View style={{
        marginTop:20
      }}>
        <Text style={{
          fontFamily:'outfit'
        }}>Email</Text>
        <TextInput style={styles.holder} placeholder='Enter Email'
         onChangeText={(value)=>setEmail(value)}
        />
      </View>


      {/*Password */}
      <View style={{
        marginTop:20
      }}>
        <Text style={{
          fontFamily:'outfit'
        }}>Password</Text>
        <TextInput secureTextEntry={true} style={styles.holder} placeholder='Enter Your Password'
         onChangeText={(value)=>setPassword(value)}
        />
      </View>
      {/*Create Account */}
      
      <TouchableOpacity onPress={OnCreateAccount} style={{
        padding:20,
        marginTop:30,
        backgroundColor:'black',
        borderRadius:15

      }}>
        <Text style={{
          color:'white',
          fontFamily:'outfit-bold',
          textAlign:'center'
        }}>Create Account</Text>
      </TouchableOpacity>

      {/*Sign In */}


      <TouchableOpacity 
      onPress={() => router.replace('auth/sign-in')}
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
        }}>Sign In</Text>
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
});