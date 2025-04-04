import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LZString from "lz-string";
import Ionicons from "@expo/vector-icons/Ionicons";
import Markdown from "react-native-markdown-display";
import { useRouter } from "expo-router";

const genAI = new GoogleGenerativeAI("AIzaSyBvHAM4fhg9Mfmx0QGD6Wvrlo9oQkW9Stw");

const SYSTEM_INSTRUCTION = `
"Act as a dynamic community discussion platform where two to three unique users engage in real-time conversations about health, fitness, and wellness for every query. Generate responses as if different two users are actively participating. Ensure:

✅ Diverse Usernames – Each response should have a unique name (e.g., Alex_FitPro, SarahYogaGuru, John_StrengthCoach) to make it appear as if multiple real users are contributing maximum 5.
✅ Engaging Conversations – Simulate responses with varied tones: expert advice, personal experiences, motivation, Q&A, workout tips, and nutritional insights.
✅ Deep & Realistic Insights – Generate posts and replies that mimic real discussions, incorporating scientific facts, personal anecdotes, and trending fitness topics.
✅ Multi-Turn Interactions – Users should react to each other's messages, debate ideas, and build on previous comments.
✅ Variety of Topics – Cover weight loss, muscle gain, yoga, mindfulness, diet plans, sleep optimization, and injury recovery.
✅ Adaptive Content – Generate responses based on the community’s theme (e.g., in a yoga group, focus on flexibility and meditation).
✅ Casual yet informative tone – Keep discussions engaging, avoiding robotic or generic responses.

Ensure responses vary in length mostly one or two lines, style, and perspective to make the discussion feel real and organic."
`;

const CACHE_LIMIT = 20;
let cache = {}; 

const loadCache = async () => {
  try {
    const storedCache = await AsyncStorage.getItem("chat_cache");
    if (storedCache) cache = JSON.parse(LZString.decompress(storedCache)) || {};
  } catch (error) {
    console.error("Error loading cache: ", error);
  }
};

const saveCache = async () => {
  try {
    await AsyncStorage.setItem("chat_cache", LZString.compress(JSON.stringify(cache)));
  } catch (error) {
    console.error("Error saving cache: ", error);
  }
};

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { type: "bot", text: "🌟 Hi Everyone, Welcome to the Community!!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCache();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { type: "user", text: input }]);
    setLoading(true);

    if (cache[input]) {
      console.log("Cache hit! Fetching response from memory...");
      displayMessageByMessage(cache[input]);  
      setLoading(false);
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `${SYSTEM_INSTRUCTION}\n\nUser: ${input}\n\n:`;  
      
      const [result] = await Promise.all([model.generateContent(prompt)]);
      const response = result.response?.text() || "⚠ Sorry, I couldn't generate a response.";
      
      cache[input] = response;
      if (Object.keys(cache).length > CACHE_LIMIT) delete cache[Object.keys(cache)[0]];
      await saveCache();
      
      displayMessageByMessage(response);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { type: "bot", text: "🚨 Failed to generate a response. Try again." }]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  // Function to display AI responses message by message
  const displayMessageByMessage = (responseText) => {
    const messagesArray = responseText.split("\n").filter(msg => msg.trim() !== ""); // Split response into separate messages
    let delay = 0;

    messagesArray.forEach((msg, index) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, { type: "bot", text: msg }]);
      }, delay);
      delay += 1500; // Delay between messages (1.5s)
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#D4FF00" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Community Chat</Text>
      </View>

      <ScrollView style={styles.chatContainer} contentContainerStyle={{ paddingBottom: 20 }}>
        {messages.map((msg, index) => (
          <View key={index} style={[styles.messageBubble, msg.type === "user" ? styles.userMessage : styles.botMessage]}>
            <Markdown style={msg.type === "user" ? markdownUserStyles : markdownBotStyles}>{msg.text}</Markdown>
          </View>
        ))}
        {loading && <ActivityIndicator size="small" color="#D4FF00" />}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type Your Message..."
          placeholderTextColor="#888"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
          <Ionicons name="send" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backButton: { marginRight: 10 },
  headerText: { fontSize: 22, fontFamily: "outfit-bold", color: "#D4FF00" },
  chatContainer: { flex: 1, marginBottom: 10 },
  messageBubble: { maxWidth: "80%", padding: 10, borderRadius: 10, marginBottom: 10 },
  userMessage: { alignSelf: "flex-end", backgroundColor: "#D4FF00" },
  botMessage: { alignSelf: "flex-start", backgroundColor: "#333" },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#222", borderRadius: 30, paddingHorizontal: 10, paddingVertical: 8 },
  input: { flex: 1, color: "white", fontSize: 16, fontFamily: "outfit-medium", paddingHorizontal: 10 },
  sendButton: { backgroundColor: "#D4FF00", padding: 10, borderRadius: 20, marginLeft: 10 },
});

const markdownUserStyles = { body: { color: "black", fontSize: 16, fontFamily: "outfit-medium" } };
const markdownBotStyles = { body: { color: "white", fontSize: 16, fontFamily: "outfit-medium" } };