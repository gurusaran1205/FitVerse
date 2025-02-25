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
            fontFamily:'caveat-bold',
            textAlign:'center',
            color:'#D4FF00',
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
            <Text style={{color:'black',
            textAlign:'center',
            fontFamily:'outfit-medium',
            fontSize:18
            }}> Get Started </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'black',
        marginTop:-20,
        height:'100%',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        padding:15
    },
    button:{
        padding:15,
        backgroundColor:'#D4FF00',
        borderRadius:99,
        marginTop:'25%'
    }
})

