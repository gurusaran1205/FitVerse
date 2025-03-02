import { View, Text, Image, StyleSheet, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useFonts } from 'expo-font';

export default function Login() {

    const router = useRouter();
    const [fontsLoaded] = useFonts({
        'Caveat-Bold': require('./../assets/fonts/Caveat-Bold.ttf'),
        'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
      });
    
      if (!fontsLoaded) {
        return null; // Prevent rendering until fonts are loaded
      }

     

return (
    <View style={styles.imageWrapper}>
      <Image source={require('./../assets/images/start2.jpeg')}
        style={styles.image}
      />
      <View style={styles.container}>
        <Text style={styles.title}> Fit Verse </Text>
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
            <Text style={styles.buttonText}> Get Started </Text>
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
        marginTop:'10%',
        shadowColor: '#D4FF00',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 10,
        transform: [{scale: 1}],
    },
    buttonText:{
      color:'black',
      textAlign:'center',
      fontFamily:'outfit-medium',
      fontSize:18,
    },
    imageWrapper:{
      position:'relative',
      width:'100%',
      height:600,
    },
    image:{
      width:'100%',
      height:'100%',
      resizeMode: 'cover'
    },
    title:{
      fontSize:50,
      fontFamily:'Caveat-Bold',
      textAlign:'center',
      color:'#D4FF00',
      marginTop:10,
      textShadowColor: '#D4FF00',
      textShadowOffset: {width: 0, height: 0},
      textShadowRadius: 12,

    }
})

