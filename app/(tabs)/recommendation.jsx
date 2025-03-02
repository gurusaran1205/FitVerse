import { View, Text, Alert, Button, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db} from "../../configs/FirebaseConfigs";




const genAI = new GoogleGenerativeAI("AIzaSyBvHAM4fhg9Mfmx0QGD6Wvrlo9oQkW9Stw");



const Recommendation = () => {
  const [vitals, setVitals] = useState(null);
  const [recommendation,setRecommendation] = useState("");

  useEffect(() => {
    const fetchVitals = async () => {
      try{
        const userId = auth.currentUser?.uid;
        if(!userId){
          Alert.alert("You are not logged in");
          return;
        }

        const vitalsDoc = await getDoc(doc(db, "Vitals", userId));
        if(vitalsDoc.exists()){
          setVitals(vitalsDoc.data());
        }else{
          Alert.alert("No Vitals Found");
        }
      }
      catch(error){
        console.error(error);
        Alert.alert("Error Loading data");
      }
    };

    fetchVitals();
  },[]);

  const getSuggestions = async () => {
    if(!vitals){
      Alert.alert("Vitals are not available");
      return;
    }

    const prompt = `
      I have the following health vitals:
      - Age: ${vitals.age}
      - Height: ${vitals.height} cm
      - Weight: ${vitals.weight}kg
      - BMI: ${vitals.bmi}
      - Blood Pressure ${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}
      - Heart Rate: ${vitals.heartRate} bpm 
      
      Based on this, Suggest me a ** healthy diet plan ** and a **daily exercise routine** in some two different plans based on my budget low,medium and high?
      `;


    try{
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro"});
      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      setRecommendation(response);

    }
    catch(error){
      console.error(error);
      Alert.alert("Failed to get AI Suggestions, Try Again Later")

    }
  };


  return (
    <ScrollView>
    <View>
      <Text> Your AI Health, Diet and Exercise Recommendation</Text>
      <Button title='Get Diet & Exercise Plan' onPress={getSuggestions}/>
      {recommendation ? <Text>{recommendation}</Text>: <Text>No recommendations yet.</Text>}
    
    </View>
    </ScrollView>
  );
};

export default Recommendation;