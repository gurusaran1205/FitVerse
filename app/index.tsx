import { Text, View } from "react-native";
import Login from './../components/Login'
import {auth} from './../configs/FirebaseConfigs'; 
import { Redirect } from "expo-router";
import {useEffect, useState} from "react";
import Gender from './forms/Gender'
import Fitness from './../components/Fitness'
import PlanDetails from './forms/PlanDetails'
import GpsTracker from './forms/GpsTracker'
import TrackingSummary from './forms/TrackingSummary'
import MedicalPreferencesForm from './forms/MedicalPreferencesForm'
import Option1 from './forms/Option1'
import ChatWithExperts from './forms/ChatwithExperts'
import DailyTasks from './forms/DailyTasks'


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
