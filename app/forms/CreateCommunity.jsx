"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
} from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { db } from "../../configs/FirebaseConfigs"

export default function CreateCommunity() {
  const router = useRouter()
  const auth = getAuth()
  const currentUserId = auth.currentUser?.uid

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [maxMembers, setMaxMembers] = useState("1000")
  const [allowMemberPosts, setAllowMemberPosts] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleCreateCommunity = async () => {
    if (!currentUserId) {
      Alert.alert("Error", "You need to be logged in to create a community")
      return
    }

    if (!name.trim()) {
      Alert.alert("Error", "Community name is required")
      return
    }

    if (!description.trim()) {
      Alert.alert("Error", "Community description is required")
      return
    }

    const maxMembersNum = Number.parseInt(maxMembers)
    if (isNaN(maxMembersNum) || maxMembersNum < 10) {
      Alert.alert("Error", "Maximum members must be at least 10")
      return
    }

    setLoading(true)

    try {
      const newCommunity = {
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        ownerId: currentUserId,
        ownerName: auth.currentUser?.displayName || "Anonymous",
        createdAt: serverTimestamp(),
        members: [currentUserId],
        memberCount: 1,
        maxMembers: maxMembersNum,
        allowMemberPosts: allowMemberPosts,
        latestActivity: "Community created",
      }

      const docRef = await addDoc(collection(db, "communities"), newCommunity)

      Alert.alert("Success", "Community created successfully")
      router.push('/forms/LeaderBoard')
    } catch (error) {
      console.error("Error creating community:", error)
      Alert.alert("Error", "Failed to create community")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.heading}>Create Community</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Community Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter an engaging community name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
            maxLength={50}
          />
          <Text style={styles.helperText}>Choose a catchy, descriptive name (max 50 characters)</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          <TextInput
            style={styles.input}
            placeholder="E.g., Yoga, Weight Loss, Running"
            placeholderTextColor="#888"
            value={category}
            onChangeText={setCategory}
          />
          <Text style={styles.helperText}>Help others find your community with a relevant category</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write an exciting, professional description"
            placeholderTextColor="#888"
            multiline
            value={description}
            onChangeText={setDescription}
            maxLength={500}
          />
          <Text style={styles.helperText}>{description.length}/500 characters - Be descriptive and engaging</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Maximum Members</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter maximum number of members"
            placeholderTextColor="#888"
            value={maxMembers}
            onChangeText={setMaxMembers}
            keyboardType="numeric"
          />
          <Text style={styles.helperText}>Set a limit for your community size (minimum 10)</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Member Permissions</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Allow members to create posts</Text>
            <Switch
              trackColor={{ false: "#333", true: "rgba(212, 255, 0, 0.3)" }}
              thumbColor={allowMemberPosts ? "#D4FF00" : "#666"}
              onValueChange={setAllowMemberPosts}
              value={allowMemberPosts}
            />
          </View>
          <Text style={styles.helperText}>
            {allowMemberPosts
              ? "Members can create posts and participate in discussions"
              : "Only you can create posts, members can only comment"}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#D4FF00" />
          <Text style={styles.infoText}>
            As the community owner, you'll be responsible for moderating content and ensuring it follows community
            guidelines.
          </Text>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreateCommunity} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text style={styles.createButtonText}>Create Community</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#D4FF00",
    padding: 10,
    borderRadius: 50,
    marginRight: 16,
  },
  heading: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: "#D4FF00",
  },
  formContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "white",
    fontSize: 16,
    fontFamily: "outfit-medium",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    color: "white",
    fontFamily: "outfit-regular",
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  helperText: {
    color: "#888",
    fontSize: 12,
    fontFamily: "outfit-regular",
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
  },
  switchLabel: {
    color: "white",
    fontFamily: "outfit-regular",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "rgba(212, 255, 0, 0.05)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  infoText: {
    color: "#BBBBBB",
    fontSize: 12,
    fontFamily: "outfit-regular",
    marginLeft: 8,
    flex: 1,
  },
  createButton: {
    backgroundColor: "#D4FF00",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  createButtonText: {
    color: "black",
    fontFamily: "outfit-bold",
    fontSize: 16,
  },
})