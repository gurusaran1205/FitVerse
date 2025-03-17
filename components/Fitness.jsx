import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const Fitness = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Fitness Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.title}>Fitness Tracking</Text>
        <ProgressCircle
          style={{ height: 150 }}
          progress={0.75}
          progressColor={'#4CAF50'}
        />
        <Text style={styles.progressText}>75% of Daily Goal</Text>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{ data: [4000, 6000, 5500, 7000, 6500, 8000, 10000] }],
          }}
          width={screenWidth - 40}
          height={200}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
          }}
          bezier
          style={{ marginVertical: 10 }}
        />
      </View>

      {/* Sleep Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.title}>Sleep Tracking</Text>
        <Text style={styles.sleepText}>Last Night: 7h 45m</Text>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{ data: [6, 7, 6.5, 7.5, 8, 7, 7.5] }],
          }}
          width={screenWidth - 40}
          height={200}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(103, 58, 183, ${opacity})`,
          }}
          bezier
          style={{ marginVertical: 10 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
    color: '#4CAF50',
  },
  sleepText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#673AB7',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default Fitness;
