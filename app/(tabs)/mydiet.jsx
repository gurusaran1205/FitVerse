import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import HealthCalendar from '../../components/HealthCalendar';
import { getStreakData, updateStreak } from '../../utils/streakUtils';

export default function MyDiet() {
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);

  // Fetch streak data when component mounts
  useEffect(() => {
    const fetchStreak = async () => {
      const { currentStreak, highestStreak } = await getStreakData();
      setStreak(currentStreak);
      setHighestStreak(highestStreak);
    };
    fetchStreak();
  }, []);

  // Function to update streak when progress is logged
  const handleTaskCompletion = async () => {
    await updateStreak();
    const { currentStreak, highestStreak } = await getStreakData();
    setStreak(currentStreak);
    setHighestStreak(highestStreak);
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Fit Verse</Text>
        <TouchableOpacity 
          style={styles.addButton}
          activeOpacity={0.7}
          onPress={handleTaskCompletion} // Update streak when pressed
        >
          <Ionicons name="add-circle-sharp" size={60} color="#D4FF00" />
        </TouchableOpacity>
      </View>

      {/* Streak Section */}
      <View style={styles.streakContainer}>
        <Text style={styles.streakText}>🔥 Streak: {streak} days</Text>
        <Text style={styles.highestStreakText}>🏆 Best Streak: {highestStreak} days</Text>
      </View>

      {/* Health Calendar */}
      <HealthCalendar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingTop: 55,
    backgroundColor: 'black',
    height: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'Caveat-Bold',
    fontSize: 50,
    color: '#D4FF00',
    textShadowColor: '#D4FF00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  addButton: {
    borderRadius: 99,
    padding: 8,
    shadowColor: '#D4FF00',
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  streakContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  streakText: {
    fontSize: 30,
    color: '#D4FF00',
    fontWeight: 'bold',
  },
  highestStreakText: {
    fontSize: 18,
    color: 'white',
    marginTop: 5,
  },
});

