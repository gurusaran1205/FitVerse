import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../configs/FirebaseConfigs';
import Ionicons from '@expo/vector-icons/Ionicons';
import {router} from 'expo-router';

const StreakTracker = () => {
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [completedDates, setCompletedDates] = useState([]);

  useEffect(() => {
    fetchStreakData();
  }, []);

  const fetchStreakData = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const streakDoc = await getDoc(doc(db, 'Streaks', userId));
      if (streakDoc.exists()) {
        const data = streakDoc.data();
        setStreak(data.currentStreak || 0);
        setHighestStreak(data.highestStreak || 0);
        setCompletedDates(data.completedDates || []);
      }
    } catch (error) {
      console.error('Error fetching streak data:', error);
    }
  };

  const updateStreak = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      let updatedStreak = streak;
      let updatedCompletedDates = [...completedDates];

      if (!completedDates.includes(today)) {
        updatedCompletedDates.push(today);

        const lastCompletedDate = completedDates[completedDates.length - 1];
        if (lastCompletedDate) {
          const lastDate = new Date(lastCompletedDate);
          const todayDate = new Date(today);
          const diffDays = (todayDate - lastDate) / (1000 * 60 * 60 * 24);
          
          if (diffDays === 1) {
            updatedStreak += 1; // Increment streak if consecutive day
          } else {
            updatedStreak = 1; // Reset streak if skipped a day
          }
        } else {
          updatedStreak = 1;
        }
      }

      const updatedHighestStreak = Math.max(updatedStreak, highestStreak);
      setStreak(updatedStreak);
      setHighestStreak(updatedHighestStreak);
      setCompletedDates(updatedCompletedDates);

      await setDoc(doc(db, 'Streaks', userId), {
        currentStreak: updatedStreak,
        highestStreak: updatedHighestStreak,
        completedDates: updatedCompletedDates,
      });
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.dateBox, completedDates.includes(item) && styles.completedDate]}>
      <Text style={styles.dateText}>{item.split('-')[2]}</Text>
    </View>
  );

  const getLast7Days = () => {
    let dates = [];
    for (let i = 6; i >= 0; i--) {
      let date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔥 Streak: {streak} Days</Text>
      <Text style={styles.highestStreak}>🏆 Best Streak: {highestStreak} Days</Text>

      <FlatList
        data={getLast7Days()}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        horizontal
        contentContainerStyle={styles.dateList}
      />

      <TouchableOpacity style={styles.button} onPress={updateStreak}>
        <Ionicons name="checkmark-circle" size={24} color="black" />
        
      </TouchableOpacity>
      <TouchableOpacity style={styles.floatingButton} onPress={() => router.push("/forms/GpsTracker")}>
        <Ionicons name="add" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#D4FF00",
    marginBottom: 10,
  },
  highestStreak: {
    fontSize: 18,
    color: "white",
    marginBottom: 20,
  },
  dateList: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  dateBox: {
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedDate: {
    backgroundColor: '#D4FF00',
  },
  dateText: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D4FF00",
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
    shadowColor: "#D4FF00",
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 18,
    color: "black",
    marginLeft: 10,
    fontWeight: "bold",
  },
  floatingButton: {
    position: "absolute",
    bottom: 50,
    right: 30,
    backgroundColor: "#D4FF00",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D4FF00",
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});

export default StreakTracker;
