import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DailyTasks() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Dummy Data for testing
    const dummyTasks = [
      { id: '1', name: 'Drink a glass of water 💧', completed: false },
      { id: '2', name: 'Stretch for 5-10 minutes 🧘', completed: false },
      { id: '3', name: 'Go for a morning walk or jog 🚶‍♂️🏃', completed: false },
      { id: '4', name: 'Do a 10-minute meditation session 🧠', completed: false },
      { id: '5', name: 'Perform 30 minutes of exercise (Yoga, Strength Training, or Cardio) 💪', completed: false },
      { id: '6', name: 'Do 20 push-ups, 30 squats, and 15 burpees 🔥', completed: false },
      { id: '7', name: 'Take 10,000 steps throughout the day 👣', completed: false },
      { id: '8', name: 'Eat a healthy breakfast (Protein, Fiber, and Healthy Fats) 🥗', completed: false },
      { id: '9', name: 'Drink at least 8 glasses of water 🚰', completed: false },
      { id: '10', name: 'Limit processed sugar and junk food ❌🍩', completed: false },
      { id: '11', name: 'Take a 5-minute break every hour from screens 📵', completed: false },
      { id: '12', name: 'Get at least 7-8 hours of sleep 😴', completed: false },
    ];
    
    setTasks(dummyTasks);
    setLoading(false);
  }, []);

  const markTaskAsDone = (taskId) => {
    const updatedTasks = tasks.map(task => task.id === taskId ? { ...task, completed: true } : task);
    setTasks(updatedTasks);
    checkAllTasksDone(updatedTasks);
  };

  const checkAllTasksDone = (updatedTasks) => {
    if (updatedTasks.every(task => task.completed)) {
      Alert.alert('Great Job!', 'You completed all tasks for the day! 🎉');
      setStreak(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/(tabs)/mydiet")} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.heading}>Daily Tasks</Text>
      <Text style={styles.streak}>🔥 Streak: {streak} days</Text>
      {loading ? <Text>Loading tasks...</Text> : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={[styles.taskText, item.completed && styles.completedTask]}>{item.name}</Text>
              {!item.completed && (
                <TouchableOpacity onPress={() => markTaskAsDone(item.id)}>
                  <Ionicons name="checkmark-circle" size={30} color="#D4FF00" />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#D4FF00',
    borderRadius: 20,
    padding: 10,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#D4FF00',
  },
  streak: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF6F00',
    marginBottom: 10,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  taskText: {
    fontSize: 18,
    color: 'white',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#D4FF00',
  },
});
