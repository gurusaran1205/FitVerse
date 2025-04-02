import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function GpsTracker() {
  const [location, setLocation] = useState(null);
  const [path, setPath] = useState([]);
  const [watcher, setWatcher] = useState(null);
  const [distance, setDistance] = useState(0);
  const [region, setRegion] = useState(null);
  const [tracking, setTracking] = useState(false);

  // Request location permission and get initial location
  useEffect(() => {
    const getInitialLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied!", "Please enable location services.");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    };

    getInitialLocation();
  }, []);

  // Function to start tracking
  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied!", "Please enable location services.");
      return;
    }

    setTracking(true);

    const newWatcher = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 2000,
        distanceInterval: 2,
      },
      (newLocation) => {
        const { latitude, longitude } = newLocation.coords;

        setPath((prevPath) => {
          if (prevPath.length > 0) {
            const lastLocation = prevPath[prevPath.length - 1];
            const newDistance = calculateDistance(lastLocation, { latitude, longitude });
            setDistance((prevDistance) => prevDistance + newDistance);
          }
          return [...prevPath, { latitude, longitude }];
        });

        setLocation(newLocation);

        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    );

    setWatcher(newWatcher);
  };

  // Function to stop tracking and navigate
  const stopTracking = () => {
    if (watcher) {
      watcher.remove();
      setWatcher(null);
    }

    setTracking(false);

    const kcalBurned = calculateCalories(distance);
    Alert.alert(`Distance: ${distance.toFixed(2)} km\nCalories Burned: ${kcalBurned.toFixed(2)} kcal`);

    router.push({
      pathname: "/forms/TrackingSummary",
      params: { distance: distance.toFixed(2), calories: kcalBurned.toFixed(2) },
    });

    setPath([]);
    setDistance(0);
  };

  // Function to calculate distance
  const calculateDistance = (start, end) => {
    const toRad = (angle) => (Math.PI / 180) * angle;
    const R = 6371;

    const dLat = toRad(end.latitude - start.latitude);
    const dLon = toRad(end.longitude - start.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(start.latitude)) * Math.cos(toRad(end.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Function to estimate calories burned
  const calculateCalories = (distance) => {
    const MET = 3.8;
    const weight = 70;
    return MET * weight * (distance / 1.609);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      {/* Map View */}
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Current Location"
          />
        )}
        <Polyline coordinates={path} strokeWidth={5} strokeColor="blue" />
      </MapView>

      {/* Tracking Indicator */}
      {tracking && (
        <View style={styles.trackingIndicator}>
          <ActivityIndicator size="small" color="#D4FF00" />
          <Text style={styles.trackingText}>Tracking...</Text>
        </View>
      )}

      {/* Floating Buttons */}
      <View style={styles.buttonContainer}>
        {!tracking ? (
          <TouchableOpacity style={styles.startButton} onPress={startTracking}>
            <Ionicons name="play-circle" size={30} color="black" />
            <Text style={styles.buttonText}>Start Tracking</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopButton} onPress={stopTracking}>
            <Ionicons name="stop-circle" size={30} color="white" />
            <Text style={styles.buttonText}>Stop Tracking</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  map: { flex: 1 },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 50,
  },
  trackingIndicator: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  trackingText: { color: "#D4FF00", fontSize: 16, marginLeft: 8 },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    flexDirection: "row",
    gap: 15,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D4FF00",
    padding: 12,
    borderRadius: 20,
    gap: 8,
  },
  stopButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "red",
    padding: 12,
    borderRadius: 20,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
});
