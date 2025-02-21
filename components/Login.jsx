import { View, Text, Image, StyleSheet, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

export default function Login() {

    const router = useRouter();

     

return (
    <View>
      <Image source={require('./../assets/images/login2.png')}
        style={{
            width:'100%',
            height:520
        }}
      />
      <View style={styles.container}>
        <Text style={{
            fontSize:30,
            fontFamily:'outfit-bold',
            textAlign:'center',
            color:'black',
            marginTop:10
        }}> FIT VERSE </Text>
        <Text style={{
            fontSize:18,
            fontFamily:'outfit',
            textAlign:'center',
            color:'gray',
            marginTop:20
        }}> Fuel Your Body, Elevate Your Life! 💪🏽🔥</Text>
        <TouchableOpacity style={styles.button}
            onPress= {() => router.push('auth/sign-in')}
        >
            <Text style={{color:'white',
            textAlign:'center',
            fontFamily:'outfit',
            fontSize:18
            }}> Get Started </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        marginTop:-20,
        height:'100%',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        padding:15
    },
    button:{
        padding:15,
        backgroundColor:'black',
        borderRadius:99,
        marginTop:'25%'
    }
})

