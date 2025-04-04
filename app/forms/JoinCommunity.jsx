"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { db } from "../../configs/FirebaseConfigs"

// Post Component
const Post = ({ post, isOwner, currentUserId, onDelete, onLike, onComment }) => {
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentText, setCommentText] = useState("")

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText)
      setCommentText("")
      setShowCommentInput(false)
    }
  }

  return (
    <View style={styles.postCard}>
      {post.isPinned && (
        <View style={styles.pinnedBadge}>
          <Ionicons name="pin" size={12} color="black" />
          <Text style={styles.pinnedText}>Pinned</Text>
        </View>
      )}

      <View style={styles.postHeader}>
        <Text style={styles.postAuthor}>{post.authorName || "Anonymous"}</Text>
        <Text style={styles.postTime}>
          {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleDateString() : "Just now"}
        </Text>
      </View>

      <Text style={styles.postTitle}>{post.title}</Text>
      <Text style={styles.postContent}>{post.content}</Text>

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onLike(post.id)}>
          <Ionicons
            name={post.likes?.includes(currentUserId) ? "heart" : "heart-outline"}
            size={20}
            color={post.likes?.includes(currentUserId) ? "#D4FF00" : "white"}
          />
          <Text style={styles.actionText}>{post.likes?.length || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => setShowCommentInput(!showCommentInput)}>
          <Ionicons name="chatbubble-outline" size={20} color="white" />
          <Text style={styles.actionText}>{post.comments?.length || 0}</Text>
        </TouchableOpacity>

        {isOwner && (
          <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(post.id)}>
            <Ionicons name="trash-outline" size={20} color="#FF5252" />
          </TouchableOpacity>
        )}
      </View>

      {showCommentInput && (
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor="#888"
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity style={styles.commentSubmitButton} onPress={handleSubmitComment}>
            <Ionicons name="send" size={20} color="black" />
          </TouchableOpacity>
        </View>
      )}

      {post.comments && post.comments.length > 0 && (
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsHeader}>Comments</Text>
          {post.comments.map((comment, index) => (
            <View key={index} style={styles.commentItem}>
              <Text style={styles.commentAuthor}>{comment.authorName || "Anonymous"}</Text>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

export default function CommunityDetail() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const auth = getAuth()
  const currentUserId = auth.currentUser?.uid

  const [community, setCommunity] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [showNewPostForm, setShowNewPostForm] = useState(false)
  const [isMember, setIsMember] = useState(false)

  useEffect(() => {
    fetchCommunityDetails()
    fetchPosts()
  }, [id])

  const fetchCommunityDetails = async () => {
    try {
      const communityDoc = await getDoc(doc(db, "communities", id))

      if (communityDoc.exists()) {
        const communityData = communityDoc.data()
        setCommunity(communityData)

        // Check if current user is the owner
        setIsOwner(communityData.ownerId === currentUserId)

        // Check if current user is a member
        setIsMember(communityData.members?.includes(currentUserId) || false)
      } else {
        Alert.alert("Error", "Community not found")
        router.back()
      }
    } catch (error) {
      console.error("Error fetching community details:", error)
      Alert.alert("Error", "Failed to load community details")
    }
  }

  const fetchPosts = async () => {
    try {
      const postsQuery = query(
        collection(db, "communities", id, "posts"),
        orderBy("isPinned", "desc"),
        orderBy("createdAt", "desc"),
      )

      const querySnapshot = await getDocs(postsQuery)
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setPosts(postsData)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinCommunity = async () => {
    if (!currentUserId) {
      Alert.alert("Error", "You need to be logged in to join a community")
      return
    }

    try {
      const communityRef = doc(db, "communities", id)
      const communityDoc = await getDoc(communityRef)
      const communityData = communityDoc.data()

      const members = communityData.members || []
      const updatedMembers = [...members, currentUserId]

      await updateDoc(communityRef, {
        members: updatedMembers,
        memberCount: updatedMembers.length,
      })

      setIsMember(true)
      setCommunity({
        ...community,
        members: updatedMembers,
        memberCount: updatedMembers.length,
      })

      Alert.alert("Success", "You have joined this community")
    } catch (error) {
      console.error("Error joining community:", error)
      Alert.alert("Error", "Failed to join community")
    }
  }

  const handleLeaveCommunity = async () => {
    try {
      const communityRef = doc(db, "communities", id)
      const communityDoc = await getDoc(communityRef)
      const communityData = communityDoc.data()

      const members = communityData.members || []
      const updatedMembers = members.filter((memberId) => memberId !== currentUserId)

      await updateDoc(communityRef, {
        members: updatedMembers,
        memberCount: updatedMembers.length,
      })

      setIsMember(false)
      setCommunity({
        ...community,
        members: updatedMembers,
        memberCount: updatedMembers.length,
      })

      Alert.alert("Success", "You have left this community")
    } catch (error) {
      console.error("Error leaving community:", error)
      Alert.alert("Error", "Failed to leave community")
    }
  }

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    try {
      const newPost = {
        title: newPostTitle,
        content: newPostContent,
        authorId: currentUserId,
        authorName: auth.currentUser?.displayName || "Anonymous",
        createdAt: serverTimestamp(),
        likes: [],
        comments: [],
        isPinned: false,
      }

      await addDoc(collection(db, "communities", id, "posts"), newPost)

      // Update latest activity
      await updateDoc(doc(db, "communities", id), {
        latestActivity: `New post: ${newPostTitle.substring(0, 20)}${newPostTitle.length > 20 ? "..." : ""}`,
      });
      

      setNewPostTitle("")
      setNewPostContent("")
      setShowNewPostForm(false)
      fetchPosts()

      Alert.alert("Success", "Post created successfully")
    } catch (error) {
      console.error("Error creating post:", error)
      Alert.alert("Error", "Failed to create post")
    }
  }

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, "communities", id, "posts", postId))
      setPosts(posts.filter((post) => post.id !== postId))
      Alert.alert("Success", "Post deleted successfully")
    } catch (error) {
      console.error("Error deleting post:", error)
      Alert.alert("Error", "Failed to delete post")
    }
  }

  const handleLikePost = async (postId) => {
    if (!currentUserId) {
      Alert.alert("Error", "You need to be logged in to like a post")
      return
    }

    try {
      const postRef = doc(db, "communities", id, "posts", postId)
      const postDoc = await getDoc(postRef)
      const postData = postDoc.data()

      const likes = postData.likes || []
      let updatedLikes

      if (likes.includes(currentUserId)) {
        updatedLikes = likes.filter((id) => id !== currentUserId)
      } else {
        updatedLikes = [...likes, currentUserId]
      }

      await updateDoc(postRef, { likes: updatedLikes })

      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return { ...post, likes: updatedLikes }
          }
          return post
        }),
      )
    } catch (error) {
      console.error("Error liking post:", error)
      Alert.alert("Error", "Failed to like post")
    }
  }

  const handleAddComment = async (postId, commentText) => {
    if (!currentUserId) {
      Alert.alert("Error", "You need to be logged in to comment")
      return
    }

    try {
      const postRef = doc(db, "communities", id, "posts", postId)
      const postDoc = await getDoc(postRef)
      const postData = postDoc.data()

      const comments = postData.comments || []
      const newComment = {
        authorId: currentUserId,
        authorName: auth.currentUser?.displayName || "Anonymous",
        text: commentText,
        createdAt: new Date(),
      }

      const updatedComments = [...comments, newComment]

      await updateDoc(postRef, { comments: updatedComments })

      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return { ...post, comments: updatedComments }
          }
          return post
        }),
      )
    } catch (error) {
      console.error("Error adding comment:", error)
      Alert.alert("Error", "Failed to add comment")
    }
  }

  const handleTogglePinPost = async (postId) => {
    try {
      const postRef = doc(db, "communities", id, "posts", postId)
      const postDoc = await getDoc(postRef)
      const isPinned = postDoc.data().isPinned

      await updateDoc(postRef, { isPinned: !isPinned })

      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return { ...post, isPinned: !isPinned }
          }
          return post
        }),
      )

      Alert.alert("Success", isPinned ? "Post unpinned" : "Post pinned")
    } catch (error) {
      console.error("Error toggling pin status:", error)
      Alert.alert("Error", "Failed to update pin status")
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.heading} numberOfLines={1}>
          {community?.name || "Community"}
        </Text>
      </View>

      <View style={styles.communityInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="people" size={20} color="#D4FF00" />
          <Text style={styles.memberCountText}>{community?.memberCount || 0} members</Text>
        </View>
        <Text style={styles.communityDescription}>{community?.description || "No description available"}</Text>

        {!isOwner && (
          <TouchableOpacity
            style={[styles.joinButton, isMember && styles.leaveButton]}
            onPress={isMember ? handleLeaveCommunity : handleJoinCommunity}
          >
            <Text style={[styles.joinButtonText, isMember && styles.leaveButtonText]}>
              {isMember ? "Leave Community" : "Join Community"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.postsContainer}>
        <View style={styles.postsHeader}>
          <Text style={styles.postsTitle}>Posts</Text>
          <TouchableOpacity style={styles.newPostButton} onPress={() => setShowNewPostForm(!showNewPostForm)}>
            <Ionicons name={showNewPostForm ? "close" : "add"} size={20} color="black" />
            <Text style={styles.newPostButtonText}>{showNewPostForm ? "Cancel" : "New Post"}</Text>
          </TouchableOpacity>
        </View>

        {showNewPostForm && (
          <View style={styles.newPostForm}>
            <TextInput
              style={styles.newPostTitle}
              placeholder="Post title"
              placeholderTextColor="#888"
              value={newPostTitle}
              onChangeText={setNewPostTitle}
            />
            <TextInput
              style={styles.newPostContent}
              placeholder="Write your post..."
              placeholderTextColor="#888"
              multiline
              value={newPostContent}
              onChangeText={setNewPostContent}
            />
            <TouchableOpacity style={styles.submitPostButton} onPress={handleCreatePost}>
              <Text style={styles.submitPostButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        )}

        {posts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No posts yet</Text>
            <Text style={styles.emptyStateSubtext}>Be the first to post in this community</Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            renderItem={({ item }) => (
              <Post
                post={item}
                isOwner={isOwner || item.authorId === currentUserId}
                currentUserId={currentUserId}
                onDelete={handleDeletePost}
                onLike={handleLikePost}
                onComment={handleAddComment}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.postsList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
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
    flex: 1,
  },
  communityInfo: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#D4FF00",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  memberCountText: {
    color: "white",
    marginLeft: 8,
    fontFamily: "outfit-medium",
  },
  communityDescription: {
    color: "#BBBBBB",
    marginBottom: 16,
    fontFamily: "outfit-regular",
  },
  joinButton: {
    backgroundColor: "#D4FF00",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  joinButtonText: {
    color: "black",
    fontFamily: "outfit-bold",
    fontSize: 16,
  },
  leaveButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#D4FF00",
  },
  leaveButtonText: {
    color: "#D4FF00",
  },
  postsContainer: {
    flex: 1,
  },
  postsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  postsTitle: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: "white",
  },
  newPostButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D4FF00",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  newPostButtonText: {
    color: "black",
    marginLeft: 4,
    fontFamily: "outfit-medium",
  },
  newPostForm: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  newPostTitle: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    color: "white",
    fontFamily: "outfit-medium",
    fontSize: 16,
    marginBottom: 12,
  },
  newPostContent: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    color: "white",
    fontFamily: "outfit-regular",
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  submitPostButton: {
    backgroundColor: "#D4FF00",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  submitPostButtonText: {
    color: "black",
    fontFamily: "outfit-bold",
    fontSize: 16,
  },
  postsList: {
    paddingBottom: 20,
  },
  postCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  pinnedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#D4FF00",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  pinnedText: {
    color: "black",
    fontSize: 12,
    fontFamily: "outfit-medium",
    marginLeft: 4,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  postAuthor: {
    color: "white",
    fontFamily: "outfit-medium",
    fontSize: 14,
  },
  postTime: {
    color: "#888",
    fontSize: 12,
    fontFamily: "outfit-regular",
  },
  postTitle: {
    color: "white",
    fontFamily: "outfit-bold",
    fontSize: 18,
    marginBottom: 8,
  },
  postContent: {
    color: "#BBBBBB",
    fontFamily: "outfit-regular",
    marginBottom: 16,
  },
  postActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionText: {
    color: "white",
    marginLeft: 4,
    fontFamily: "outfit-medium",
  },
  commentInputContainer: {
    flexDirection: "row",
    marginTop: 12,
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: "white",
    fontFamily: "outfit-regular",
  },
  commentSubmitButton: {
    backgroundColor: "#D4FF00",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  commentsContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  commentsHeader: {
    color: "white",
    fontFamily: "outfit-medium",
    fontSize: 16,
    marginBottom: 8,
  },
  commentItem: {
    marginBottom: 8,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#444",
  },
  commentAuthor: {
    color: "white",
    fontFamily: "outfit-medium",
    fontSize: 14,
  },
  commentText: {
    color: "#BBBBBB",
    fontFamily: "outfit-regular",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    color: "white",
    fontSize: 18,
    fontFamily: "outfit-bold",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: "#888",
    fontSize: 14,
    fontFamily: "outfit-regular",
  },
})