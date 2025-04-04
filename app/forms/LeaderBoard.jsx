"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "../../configs/FirebaseConfigs"

// Trophy icons for top 3
const trophyIcons = {
  1: { icon: "trophy", color: "#FFD700" }, // Gold
  2: { icon: "trophy", color: "#C0C0C0" }, // Silver
  3: { icon: "trophy", color: "#CD7F32" }, // Bronze
}

// Leaderboard Item Component
const LeaderboardItem = ({ community, rank, onPress, isTopFive }) => (
  <TouchableOpacity
    style={[styles.leaderboardItem, isTopFive && styles.topFiveItem, rank === 1 && styles.firstPlaceItem]}
    onPress={() => onPress(community.id)}
  >
    <View
      style={[
        styles.rankContainer,
        rank <= 3 && {
          backgroundColor: `rgba(${rank === 1 ? "255, 215, 0" : rank === 2 ? "192, 192, 192" : "205, 127, 50"}, 0.2)`,
        },
      ]}
    >
      {rank <= 3 ? (
        <Ionicons name={trophyIcons[rank].icon} size={20} color={trophyIcons[rank].color} />
      ) : (
        <Text style={styles.rankText}>{rank}</Text>
      )}
    </View>

    <View style={styles.communityInfo}>
      <Text style={[styles.communityName, isTopFive && styles.topFiveName]}>{community.name}</Text>
      <Text style={styles.communityCategory}>{community.category || "General"}</Text>
      <Text style={styles.communityDescription} numberOfLines={isTopFive ? 2 : 1}>
        {community.description}
      </Text>
    </View>

    <View style={styles.rightSection}>
      <View style={styles.memberCount}>
        <Ionicons name="people" size={16} color="#D4FF00" />
        <Text style={styles.memberCountText}>{community.memberCount}</Text>
      </View>

      {isTopFive && (
        <TouchableOpacity style={styles.joinButton} onPress={() => onPress(community.id)}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      )}
    </View>
  </TouchableOpacity>
)

export default function CommunityLeaderboard() {
  const router = useRouter()
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const leaderboardQuery = query(collection(db, "communities"), orderBy("memberCount", "desc"), limit(50))

      const querySnapshot = await getDocs(leaderboardQuery)
      const communitiesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setCommunities(communitiesData)
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommunityPress = (communityId) => {
    router.push(`/forms/JoinCommunity?id=${communityId}`);
    Alert.alert("Success","You have joined the community!")
}
  const handleCommunityPress1 = (communityId) => {
    router.push(`/forms/JoinChat?id=${communityId}`);
}


  const renderHeader = () => (
    <View style={styles.leaderboardHeader}>
      <Text style={styles.leaderboardTitle}>Community Champions</Text>
      <Text style={styles.leaderboardSubtitle}>The most popular fitness communities based on member count</Text>

      {communities.length > 0 && (
        <View style={styles.topCommunityCard}>
          <View style={styles.crownContainer}>
            <Ionicons name="crown" size={30} color="#FFD700" />
          </View>

          <Text style={styles.topCommunityName}>{communities[0].name}</Text>
          <Text style={styles.topCommunityCategory}>{communities[0].category || "General"}</Text>

          <View style={styles.topCommunityStats}>
            <View style={styles.topCommunityStat}>
              <Ionicons name="people" size={20} color="#D4FF00" />
              <Text style={styles.topCommunityStatText}>{communities[0].memberCount} members</Text>
            </View>
          </View>

          <Text style={styles.topCommunityDescription} numberOfLines={2}>
            {communities[0].description}
          </Text>

          <TouchableOpacity style={styles.viewButton} onPress={() => handleCommunityPress1(communities[0].id)}>
            <Text style={styles.viewButtonText}>View Community</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4FF00" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Community Leaderboard</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {communities.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="trophy" size={60} color="#444" />
          <Text style={styles.emptyStateText}>No communities found</Text>
        </View>
      ) : (
        <FlatList
          data={communities}
          ListHeaderComponent={renderHeader}
          renderItem={({ item, index }) => (
            <LeaderboardItem community={item} rank={index + 1} onPress={handleCommunityPress} isTopFive={index < 5} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    color: "#D4FF00",
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: 0,
    backgroundColor: "#D4FF00",
    padding: 10,
    bottom:30,
    borderRadius: 50,
  },
  leaderboardHeader: {
    marginBottom: 20,
  },
  leaderboardTitle: {
    fontSize: 22,
    fontFamily: "outfit-bold",
    color: "white",
  },
  leaderboardSubtitle: {
    fontSize: 14,
    fontFamily: "outfit-regular",
    color: "#888",
    marginBottom: 20,
  },
  topCommunityCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  crownContainer: {
    position: "absolute",
    top: -15,
    right: 20,
    backgroundColor: "#121212",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  topCommunityName: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: "white",
    marginBottom: 4,
  },
  topCommunityCategory: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: "#D4FF00",
    marginBottom: 12,
  },
  topCommunityStats: {
    flexDirection: "row",
    marginBottom: 12,
  },
  topCommunityStat: {
    flexDirection: "row",
    alignItems: "center",
  },
  topCommunityStatText: {
    color: "white",
    fontFamily: "outfit-medium",
    marginLeft: 6,
  },
  topCommunityDescription: {
    color: "#BBBBBB",
    fontFamily: "outfit-regular",
    marginBottom: 16,
  },
  viewButton: {
    backgroundColor: "#D4FF00",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  viewButtonText: {
    color: "black",
    fontFamily: "outfit-bold",
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 20,
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  topFiveItem: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#1A1A1A",
  },
  firstPlaceItem: {
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  rankContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(212, 255, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rankText: {
    color: "#D4FF00",
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    color: "white",
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
  topFiveName: {
    fontSize: 18,
  },
  communityCategory: {
    color: "#D4FF00",
    fontSize: 12,
    fontFamily: "outfit-regular",
  },
  communityDescription: {
    color: "#888",
    fontSize: 12,
    fontFamily: "outfit-regular",
    marginTop: 2,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  memberCount: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(212, 255, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  memberCountText: {
    color: "#D4FF00",
    marginLeft: 4,
    fontFamily: "outfit-medium",
    fontSize: 12,
  },
  joinButton: {
    backgroundColor: "#D4FF00",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  joinButtonText: {
    color: "black",
    fontFamily: "outfit-bold",
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    color: "#888",
    fontSize: 16,
    fontFamily: "outfit-medium",
    marginTop: 16,
  },
})