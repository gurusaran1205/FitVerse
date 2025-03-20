import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { ProgressBar } from "react-native-paper";
import { LineChart, PieChart } from "react-native-chart-kit";
import Svg, { Path } from "react-native-svg";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const FitnessAnalytics = () => {
  const [data, setData] = useState({
    steps: 8500,
    calories: 2200,
    heartRate: 78,
    sleepHours: 7.5,
    hydration: 2.2,
    activeMinutes: 45,
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fitness Analytics</Text>

      {/* Steps & Calories */}
      <View style={styles.statContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{data.steps}</Text>
          <Text style={styles.statLabel}>Steps Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{data.calories}</Text>
          <Text style={styles.statLabel}>Calories Burned</Text>
        </View>
      </View>

      {/* Line Chart for Steps vs. Calories */}
      <Text style={styles.chartTitle}>Steps vs. Calories</Text>
      <LineChart
        data={{
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              data: [5000, 7000, 8000, 6500, 9000, 10000, 8500],
              color: () => "#D4FF00",
            },
            {
              data: [1800, 2000, 2100, 1900, 2300, 2500, 2200],
              color: () => "#33A1FF",
            },
          ],
        }}
        width={screenWidth - 40}
        height={200}
        chartConfig={chartConfig}
        style={styles.chart}
      />

      {/* Heart Rate & Hydration */}
      <View style={styles.statContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{data.heartRate} BPM</Text>
          <Text style={styles.statLabel}>Heart Rate</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{data.hydration} L</Text>
          <Text style={styles.statLabel}>Water Intake</Text>
          <ProgressBar progress={data.hydration / 3} color="#D4FF00" style={styles.progressBar} />
        </View>
      </View>

      {/* Sleep Analysis */}
      <Text style={styles.chartTitle}>Sleep Analysis</Text>
      <PieChart
        data={
          [
            { name: "Deep Sleep", population: 2.5, color: "#6A0572", legendFontColor: "#FFFFFF" },
            { name: "Light Sleep", population: 3.5, color: "#D4FF00", legendFontColor: "#FFFFFF" },
            { name: "REM", population: 1.5, color: "#3498db", legendFontColor: "#FFFFFF" },
          ]
        }
        width={screenWidth - 40}
        height={200}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
      />


      {/* Active Minutes */}
      <View style={styles.statCardFull}>
        <Text style={styles.statValue}>{data.activeMinutes} min</Text>
        <Text style={styles.statLabel}>Active Minutes Today</Text>
      </View>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#000",
  backgroundGradientTo: "#000",
  color: (opacity = 1) => `rgba(212, 255, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#000" },
  title: { fontSize: 24, fontWeight: "bold", color: "#D4FF00", textAlign: "center", marginBottom: 15 },
  statContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    elevation: 5,
    shadowColor: "#D4FF00",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  statCardFull: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    elevation: 5,
    shadowColor: "#D4FF00",
    shadowOpacity: 0.5,
  },
  statValue: { fontSize: 22, fontWeight: "bold", color: "#D4FF00" },
  statLabel: { fontSize: 14, color: "#D4FF00", marginTop: 5 },
  progressBar: { width: "80%", marginTop: 5 },
  chartTitle: { fontSize: 18, fontWeight: "bold", color: "#D4FF00", textAlign: "center", marginTop: 20 },
  chart: { marginVertical: 10, borderRadius: 10 },
});

export default FitnessAnalytics;