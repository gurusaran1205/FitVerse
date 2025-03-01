import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'

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
        Alert.alert("Error Loading data")
      }
    };

    fetchVitals();
  },[]);


  return (
    <View>
      <Text>recommendation</Text>
    </View>
  )
}

export default Recommendation