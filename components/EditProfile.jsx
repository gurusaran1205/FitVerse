import { View, Text, Button, StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'

const EditProfile = () => {
  return (
    <View style={styles.container}>
      <Text>EditProfile</Text>
      <TouchableOpacity onPress={() => alert("Button Clicked")}style={{
        padding:20,
        marginTop:40,
        backgroundColor:'black',
        borderRadius:15}}>
        <Text>Click here</Text>
      </TouchableOpacity>
    </View>
  )
}

export default EditProfile;

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
})