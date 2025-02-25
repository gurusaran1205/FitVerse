import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoutButton from '../../components/LogoutButton';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../configs/FirebaseConfigs';
export default function Profile() {
  const [healthData,setHealthData] = useState(null);

  useEffect(() => {
    const fetchHealthData = async () => {
      try{
        const userId = auth.currentUser.uid;
        if(!userId){
          Alert.alert("You are not logged in")
          return;
        }
        const userDoc = await getDoc(doc(db,"healthData", userId));

        if (userDoc.exists()){
          setHealthData(userDoc.data());
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
        <Text style={styles.userName}>Gurusaran A B</Text>
        <Text style={styles.aboutUser}>
          Passionate about fitness and a healthy lifestyle. Let's achieve our goals together!
        </Text>

        {/* Profile Buttons */}
        <View style={styles.userBtnWrapper}>
          <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
            <Text style={styles.userBtnTxt}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
            <Text style={styles.userBtnTxt}>Follow</Text>
          </TouchableOpacity>
        </View>

        {/* Social Info Section */}
        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>22</Text>
            <Text style={styles.userInfoSubTitle}>Posts</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>1.5K</Text>
            <Text style={styles.userInfoSubTitle}>Followers</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>180</Text>
            <Text style={styles.userInfoSubTitle}>Following</Text>
          </View>
        </View>

        {/* Health Statistics Section */}
        <View style={styles.healthStatsWrapper}>
        {healthData ? (
          <>
        
          <View style={styles.healthStatsItem}>
            <Text style={styles.healthStatsTitle}>{healthData.bmi || "N/A"}</Text>
            <Text style={styles.healthStatsSubTitle}>BMI</Text>
          </View>
          <View style={styles.healthStatsItem}>
            <Text style={styles.healthStatsTitle}>{healthData.sugar || "N/A"}</Text>
            <Text style={styles.healthStatsSubTitle}>Sugar Level</Text>
          </View>
          <View style={styles.healthStatsItem}>
            <Text style={styles.healthStatsTitle}>10,000</Text>
            <Text style={styles.healthStatsSubTitle}>Steps Walked</Text>
          </View>
          <View style={styles.healthStatsItem}>
            <Text style={styles.healthStatsTitle}>2.5L</Text>
            <Text style={styles.healthStatsSubTitle}>Water Intake</Text>
          </View>
          </>
        ) : (
          <Text style={styles.loadingText}>Loading Health Data...</Text>
        ) }
        </View>

        

        {/* Logout Button */}
        <LogoutButton />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
    marginTop: 20,
    borderWidth: 2,
    borderColor: 'black',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  aboutUser: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
    paddingHorizontal: 30,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    marginTop: 15,
  },
  userBtn: {
    backgroundColor: 'black',
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
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  healthStatsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  healthStatsItem: {
    width: '45%',
    backgroundColor: '#fff',
    padding: 15,
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  healthStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  healthStatsSubTitle: {
    fontSize: 14,
    color: '#666',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  userInfoItem: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
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

