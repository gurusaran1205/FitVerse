import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoutButton from '../../components/LogoutButton';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../configs/FirebaseConfigs';
import AnalyticsButton from '../../components/AnalyticsButton';
import ChatWithExperts from '../../components/ChatWithExperts';

export default function Profile() {
  const [healthData,setHealthData] = useState(null);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const fetchHealthData = async () => {
      try{
        const userId = auth.currentUser.uid;
        if(!userId){
          Alert.alert("You are not logged in")
          return;
        }
        const userDoc = await getDoc(doc(db, "users", userId));
        if(userDoc.exists()){
          setFullName(userDoc.data().fullName);
        }
        else{
          Alert.alert("User not found");
        }


        const healthDoc = await getDoc(doc(db,"Vitals", userId));

        if (healthDoc.exists()){
          setHealthData(healthDoc.data());
        }else{
          Alert.alert("No data & Records found");
        }

      }catch(error){
        console.log(error);
        Alert.alert("Error, Failed to load data");

      }
    };
    fetchHealthData();

  },[]);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Image */}
        <Image style={styles.userImg} source={require('../../assets/images/login1.png')} />

        {/* User Name & Bio */}
        <Text style={styles.userName}>{fullName}</Text>
        <Text style={styles.aboutUser}>
          Passionate about fitness and a healthy lifestyle. Let's achieve our goals together!
        </Text>

        {/* Health Statistics Section */}
        <View style={styles.healthStatsWrapper}>
        {healthData ? (
          <>
          <View style={styles.healthStatsItem}>
            <Text style={styles.healthStatsTitle}>{healthData.weight} kg</Text>
            <Text style={styles.healthStatsSubTitle}>Weight</Text>
          </View>
          <View style={styles.healthStatsItem}>
            <Text style={styles.healthStatsTitle}>{healthData.height} cm</Text>
            <Text style={styles.healthStatsSubTitle}>Height</Text>
          </View>
          <View style={styles.healthStatsItem}>
            <Text style={styles.healthStatsTitle}>{healthData.bmi || "N/A"}</Text>
            <Text style={styles.healthStatsSubTitle}>BMI</Text>
          </View>
          <View style={styles.healthStatsItem}>
            <Text style={styles.healthStatsTitle}>{healthData.age || "N/A"}</Text>
            <Text style={styles.healthStatsSubTitle}>Age</Text>
          </View>
          <View style={styles.healthStatsItem}>
            <Text style={styles.healthStatsTitle}>{healthData.heartRate || "N/A"}</Text>
            <Text style={styles.healthStatsSubTitle}>Heart Rate</Text>
          </View>
          <View style={styles.healthStatsItem}>
            <Text style={styles.healthStatsTitle}>{healthData.bloodPressure?.systolic}/{healthData.bloodPressure?.diastolic} mmHg</Text>
            <Text style={styles.healthStatsSubTitle}>Blood Pressure</Text>
          </View>

          </>
        ) : (
          <Text style={styles.loadingText}>Loading Health Data...</Text>
        ) }
        </View>

        

        {/* Logout Button */}
        <ChatWithExperts/>
        <AnalyticsButton/>
        <LogoutButton />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal:20,
  },
  userImg: {
    height: 140,
    width: 140,
    borderRadius: 70,
    marginTop: 30,
    borderWidth: 3,
    borderColor: '#D4FF00',
    shadowColor: '#D4FF00',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    color:'#D4FF00'
  },
  aboutUser: {
    textAlign: 'center',
    fontSize: 14,
    color: 'white',
    marginVertical: 10,
    paddingHorizontal: 30,
    lineHeight: 20,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    marginTop: 15,
  },
  userBtn: {
    backgroundColor: '#D4FF00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  userBtnTxt: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  healthStatsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 25,
  },
  healthStatsItem: {
    width: '45%',
    backgroundColor: '#D4FF00',
    paddingVertical: 18,
    paddingHorizontal: 10,
    margin: 5,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  healthStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  healthStatsSubTitle: {
    fontSize: 14,
    color: '#333',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  userInfoItem: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#D4FF00',
    borderRadius: 10,
    marginHorizontal: 10,
    width: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  userInfoSubTitle: {
    fontSize: 14,
    color: '#666',
  },
  loadingText: {
    fontSize:16,
    color: 'gray',
    textAlign:'center',
    marginTop:20,
  }
});

