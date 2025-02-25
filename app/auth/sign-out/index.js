import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, Alert, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { TextInput } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {auth, db} from './../../../configs/FirebaseConfigs'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
export default function signUp() {
  const navigation = useNavigation();
  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [fullName,setFullName] = useState("");

  useEffect(() => {
    navigation.setOptions({
      headerShown:false
    })
  },[]);

  const saveUserData = async (userId, name, email) => {
    try{
      await setDoc(doc(db,"users",userId), {
        fullName: name,
        email: email,
        createdAt: new Date(),
      });
      console.log("User data saved to Firestore! ")
    }catch(error){
      console.error("Error saving user data: ", error);
    }
  };

  const OnCreateAccount = async(name,email,password) => {
    if(!email && !password && !fullName){
      ToastAndroid.show('Please Enter All Details,',ToastAndroid.BOTTOM)
      return ;
    }
    try{
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: fullName,
      });

      await saveUserData(user.uid, fullName, email);


      await sendEmailVerification(user);
      ToastAndroid.show('User Account Created',ToastAndroid.BOTTOM)
      router.replace('/mydiet');
    }catch (error){
      console.error(error.message);
      ToastAndroid.show('Sign-up failed: ' + error.message, ToastAndroid.LONG);
    }
  };

  return (
    <ImageBackground 
          source={require('../../../assets/images/signup1.jpeg')}
          style={styles.background}
          imageStyle={{opacity:1}}
        
        >
    <View style={{
      padding:25,
      paddingTop:50,
      height:'100%'
    }}>
      <TouchableOpacity onPress={() => router.back()}>
        <MaterialIcons name="arrow-back-ios-new" size={24} color='#D4FF00' />
      </TouchableOpacity>

      <Text style={{
        fontSize:30,
        fontFamily:'outfit-bold',
        color:'#D4FF00'
      }}>Create New Account</Text>


      {/*Name */}
      <View style={{
        marginTop:20
      }}>
        <Text style={{
          fontFamily:'outfit',
          color:'#D4FF00'
          
          

        }}>Full Name</Text>
        <TextInput style={styles.holder} placeholder='Enter Full Name' placeholderTextColor='gray'
         onChangeText={(value)=>setFullName(value)} 
        />
      </View>

      {/*Email */}
      <View style={{
        marginTop:20
      }}>
        <Text style={{
          fontFamily:'outfit',
          color:'#D4FF00'
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
          fontFamily:'outfit',
          color:'#D4FF00'
        }}>Password</Text>
        <TextInput secureTextEntry={true} style={styles.holder} placeholder='Enter Your Password' placeholderTextColor='gray'
         onChangeText={(value)=>setPassword(value)}
        />
      </View>
      {/*Create Account */}
      
      <TouchableOpacity onPress={() => OnCreateAccount(fullName,email,password)} style={{
        padding:20,
        marginTop:30,
        backgroundColor:'#D4FF00',
        borderRadius:15

      }}>
        <Text style={{
          color:'black',
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
        backgroundColor:'black',
        borderRadius:15,
        borderWidth:1,
        borderColor:'#D4FF00'

      }}>
        <Text style={{
          color:'#D4FF00',
          fontFamily:'outfit-bold',
          textAlign:'center'
        }}>Sign In</Text>
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
    borderColor:'gray',
    fontFamily:'outfit',
    color:'white'

  }
});