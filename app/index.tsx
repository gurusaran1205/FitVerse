import { Text, View } from "react-native";
import Login from './../components/Login'
import {auth} from './../configs/FirebaseConfigs'; 
import { Redirect } from "expo-router";
import {useEffect, useState} from "react";
import Gender from './forms/Gender'
import Fitness from './../components/Fitness'

export default function Index() {
  const user = auth.currentUser;

  
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      
      {user?
        <Redirect href={'/mydiet'}/>:
        <Login />

    }
      

    </View>
  );
}
