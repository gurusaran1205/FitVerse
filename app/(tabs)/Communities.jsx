"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { collection, getDocs, query, orderBy, limit, addDoc, serverTimestamp } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { db } from "../../configs/FirebaseConfigs"

// Community Card Component
const CommunityCard = ({ community, onPress, isMember }) => (
  <TouchableOpacity
    style={[styles.communityCard, isMember && styles.memberCommunityCard]}
    onPress={() => onPress(community.id, isMember)}
  >
    <View style={styles.cardHeader}>
      <Text style={styles.communityName}>{community.name}</Text>
      <View style={styles.memberCount}>
        <Ionicons name="people" size={16} color="#D4FF00" />
        <Text style={styles.memberCountText}>{community.memberCount}</Text>
      </View>
    </View>
    <Text style={styles.communityDescription} numberOfLines={2}>
      {community.description}
    </Text>
    <View style={styles.cardFooter}>
      <Text style={styles.latestActivity}>Latest: {community.latestActivity || "No recent activity"}</Text>
      {isMember && (
        <View style={styles.memberBadge}>
          <Ionicons name="checkmark-circle" size={14} color="#D4FF00" />
          <Text style={styles.memberBadgeText}>Member</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
)

// Default communities data
const defaultCommunities = [
  {
    name: "Yoga & Mindfulness Hub",
    description:
      "A sanctuary for yoga enthusiasts and mindfulness practitioners. Share poses, meditation techniques, and find your inner peace together.",
    category: "Yoga",
    memberCount: Math.floor(Math.random() * 500) + 100,
    latestActivity: "New meditation challenge posted",
  },
  {
    name: "Weight Loss Warriors",
    description:
      "Join fellow warriors on the journey to sustainable weight loss. Share success stories, meal plans, and motivate each other through challenges.",
    category: "Weight Loss",
    memberCount: Math.floor(Math.random() * 800) + 200,
    latestActivity: "Weekly weigh-in results shared",
  },
  {
    name: "Runners United",
    description:
      "From beginners to marathoners, this community celebrates the joy of running. Track progress, share routes, and join virtual races together.",
    category: "Running",
    memberCount: Math.floor(Math.random() * 600) + 150,
    latestActivity: "5K challenge started",
  },
  {
    name: "Strength Training Society",
    description:
      "Build muscle, increase strength, and perfect your form with fellow lifters. Share workout routines and transformation journeys.",
    category: "Strength",
    memberCount: Math.floor(Math.random() * 700) + 300,
    latestActivity: "New PR celebration thread",
  },
  {
    name: "Nutrition Ninjas",
    description:
      "Master the art of balanced nutrition with science-backed approaches. Exchange recipes, meal prep ideas, and nutritional wisdom.",
    category: "Nutrition",
    memberCount: Math.floor(Math.random() * 400) + 250,
    latestActivity: "Seasonal recipe collection shared",
  },
  {
    name: "HIIT Heroes",
    description:
      "High-Intensity Interval Training enthusiasts unite! Share quick, effective workouts, techniques, and results from your HIIT journey.",
    category: "HIIT",
    memberCount: Math.floor(Math.random() * 350) + 120,
    latestActivity: "20-minute apartment-friendly HIIT posted",
  },
  {
    name: "Flexibility & Mobility Masters",
    description:
      "Dedicated to improving range of motion, preventing injuries, and enhancing performance through targeted flexibility work.",
    category: "Flexibility",
    memberCount: Math.floor(Math.random() * 300) + 100,
    latestActivity: "30-day splits challenge launched",
  },
  {
    name: "Plant-Based Power",
    description:
      "Thriving on plants! Exchange vegan and vegetarian recipes, nutrition tips, and support for those exploring plant-based lifestyles.",
    category: "Nutrition",
    memberCount: Math.floor(Math.random() * 450) + 200,
    latestActivity: "High-protein vegan meal plan shared",
  },
  {
    name: "Mental Wellness Collective",
    description:
      "A supportive space focused on mental health alongside physical fitness. Share mindfulness practices, stress management, and emotional wellness strategies.",
    category: "Mental Health",
    memberCount: Math.floor(Math.random() * 500) + 300,
    latestActivity: "Anxiety management techniques discussion",
  },
  {
    name: "Outdoor Adventure Crew",
    description:
      "For those who prefer nature as their gym. Hiking, climbing, swimming, and all outdoor fitness activities welcome here.",
    category: "Outdoor",
    memberCount: Math.floor(Math.random() * 600) + 250,
    latestActivity: "Weekend hiking trip planned",
  },
]

export default function CommunityDiscovery() {
  const router = useRouter()
  const auth = getAuth()
  const currentUserId = auth.currentUser?.uid

  const [communities, setCommunities] = useState([])
  const [yourCommunities, setYourCommunities] = useState([])
  const [joinedCommunities, setJoinedCommunities] = useState([])
  const [discoverCommunities, setDiscoverCommunities] = useState([])
  const [filteredCommunities, setFilteredCommunities] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("discover") // "yours", "joined", "discover"

  useEffect(() => {
    if (currentUserId) {
      fetchCommunities()
    } else {
      setLoading(false)
    }
  }, [currentUserId])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      switch (activeTab) {
        case "yours":
          setFilteredCommunities(yourCommunities)
          break
        case "joined":
          setFilteredCommunities(joinedCommunities)
          break
        case "discover":
          setFilteredCommunities(discoverCommunities)
          break
      }
    } else {
      let communitiesToFilter = []
      switch (activeTab) {
        case "yours":
          communitiesToFilter = yourCommunities
          break
        case "joined":
          communitiesToFilter = joinedCommunities
          break
        case "discover":
          communitiesToFilter = discoverCommunities
          break
      }

      const filtered = communitiesToFilter.filter(
        (community) =>
          community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (community.category && community.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (community.description && community.description.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredCommunities(filtered)
    }
  }, [searchQuery, activeTab, yourCommunities, joinedCommunities, discoverCommunities])

  const createDefaultCommunities = async () => {
    try {
      // Check if we already have communities
      const communitiesQuery = query(collection(db, "communities"), limit(1))
      const querySnapshot = await getDocs(communitiesQuery)

      if (querySnapshot.empty) {
        // No communities exist, create default ones
        for (const community of defaultCommunities) {
          await addDoc(collection(db, "communities"), {
            ...community,
            ownerId: "system",
            ownerName: "System",
            createdAt: serverTimestamp(),
            members: [],
            maxMembers: 1000,
            allowMemberPosts: true,
          })
        }
        console.log("Default communities created")
      }
    } catch (error) {
      console.error("Error creating default communities:", error)
    }
  }

  const fetchCommunities = async () => {
    try {
      await createDefaultCommunities()

      // Fetch all communities
      const allCommunitiesQuery = query(collection(db, "communities"), orderBy("memberCount", "desc"))

      const querySnapshot = await getDocs(allCommunitiesQuery)
      const communitiesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setCommunities(communitiesData)

      // Filter communities into categories
      const owned = communitiesData.filter((c) => c.ownerId === currentUserId)
      const joined = communitiesData.filter(
        (c) => c.ownerId !== currentUserId && c.members && c.members.includes(currentUserId),
      )
      const discover = communitiesData.filter(
        (c) => c.ownerId !== currentUserId && (!c.members || !c.members.includes(currentUserId)),
      )

      setYourCommunities(owned)
      setJoinedCommunities(joined)
      setDiscoverCommunities(discover)

      // Set initial filtered communities based on active tab
      switch (activeTab) {
        case "yours":
          setFilteredCommunities(owned)
          break
        case "joined":
          setFilteredCommunities(joined)
          break
        case "discover":
          setFilteredCommunities(discover)
          break
      }
    } catch (error) {
      console.error("Error fetching communities:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommunityPress = (communityId, isMember) => {
    if (isMember) {
      // If already a member, go directly to community detail
      router.push(`/communities/${communityId}`)
    } else {
      // If not a member, go to join page
      router.push(`/communities/join?id=${communityId}`)
    }
  }

  const handleCreateCommunity = () => {
    router.push("/forms/CreateCommunity")
  }

  const handleLeaderboard = () => {
    router.push("/forms/LeaderBoard")
  }

  const changeTab = (tab) => {
    setActiveTab(tab)
    setSearchQuery("")

    switch (tab) {
      case "yours":
        setFilteredCommunities(yourCommunities)
        break
      case "joined":
        setFilteredCommunities(joinedCommunities)
        break
      case "discover":
        setFilteredCommunities(discoverCommunities)
        break
    }
  }

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
        <Text style={styles.heading}>Communities</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "yours" && styles.activeTab]}
          onPress={() => changeTab("yours")}
        >
          <Ionicons name="create" size={18} color={activeTab === "yours" ? "#D4FF00" : "#888"} />
          <Text style={[styles.tabText, activeTab === "yours" && styles.activeTabText]}>Your Communities</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "joined" && styles.activeTab]}
          onPress={() => changeTab("joined")}
        >
          <Ionicons name="checkmark-circle" size={18} color={activeTab === "joined" ? "#D4FF00" : "#888"} />
          <Text style={[styles.tabText, activeTab === "joined" && styles.activeTabText]}>Joined</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "discover" && styles.activeTab]}
          onPress={() => changeTab("discover")}
        >
          <Ionicons name="compass" size={18} color={activeTab === "discover" ? "#D4FF00" : "#888"} />
          <Text style={[styles.tabText, activeTab === "discover" && styles.activeTabText]}>Discover</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#D4FF00" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${activeTab === "yours" ? "your" : activeTab === "joined" ? "joined" : "all"} communities...`}
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {filteredCommunities.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name={
              activeTab === "yours" ? "create-outline" : activeTab === "joined" ? "people-outline" : "compass-outline"
            }
            size={60}
            color="#444"
          />
          <Text style={styles.emptyStateText}>
            {activeTab === "yours"
              ? "You haven't created any communities yet"
              : activeTab === "joined"
                ? "You haven't joined any communities yet"
                : "No communities found"}
          </Text>
          {activeTab === "yours" && (
            <TouchableOpacity style={styles.emptyStateButton} onPress={handleCreateCommunity}>
              <Text style={styles.emptyStateButtonText}>Create Community</Text>
            </TouchableOpacity>
          )}
          {activeTab === "joined" && (
            <TouchableOpacity style={styles.emptyStateButton} onPress={() => changeTab("discover")}>
              <Text style={styles.emptyStateButtonText}>Discover Communities</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredCommunities}
          renderItem={({ item }) => (
            <CommunityCard
              community={item}
              onPress={handleCommunityPress}
              isMember={item.ownerId === currentUserId || (item.members && item.members.includes(currentUserId))}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity style={styles.floatingButton} onPress={handleCreateCommunity}>
        <Ionicons name="add" size={30} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.leaderboardButton} onPress={handleLeaderboard}>
        <Ionicons name="trophy" size={24} color="black" />
      </TouchableOpacity>
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
    marginBottom: 16,
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
    borderRadius: 50,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#2A2A2A",
  },
  tabText: {
    color: "#888",
    marginLeft: 4,
    fontFamily: "outfit-medium",
    fontSize: 12,
  },
  activeTabText: {
    color: "#D4FF00",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#D4FF00",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: "white",
    fontFamily: "outfit-medium",
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 80,
  },
  communityCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#D4FF00",
  },
  memberCommunityCard: {
    borderLeftColor: "#D4FF00",
    borderLeftWidth: 5,
    backgroundColor: "#1A1A1A",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  communityName: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: "white",
    flex: 1,
  },
  memberCount: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(212, 255, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  memberCountText: {
    color: "#D4FF00",
    marginLeft: 4,
    fontFamily: "outfit-medium",
  },
  communityDescription: {
    color: "#BBBBBB",
    marginBottom: 12,
    fontFamily: "outfit-regular",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 8,
  },
  latestActivity: {
    color: "#888",
    fontSize: 12,
    fontFamily: "outfit-regular",
    flex: 1,
  },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(212, 255, 0, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  memberBadgeText: {
    color: "#D4FF00",
    fontSize: 10,
    fontFamily: "outfit-medium",
    marginLeft: 2,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#D4FF00",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#D4FF00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  leaderboardButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#D4FF00",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#D4FF00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyStateText: {
    color: "#888",
    fontSize: 16,
    fontFamily: "outfit-medium",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: "#D4FF00",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: "black",
    fontFamily: "outfit-bold",
    fontSize: 14,
  },
})