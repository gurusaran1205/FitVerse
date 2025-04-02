import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LZString from "lz-string";
import Ionicons from "@expo/vector-icons/Ionicons";
import Markdown from "react-native-markdown-display";
import { useRouter } from "expo-router";
const genAI = new GoogleGenerativeAI("AIzaSyCpn5wPidouyoSGc3Ix-bNP-Zoaf8ENwx4");

const SYSTEM_INSTRUCTION = `
You are AROGYA, a health expert. 🩺
Your job is to answer health-related queries in short, precise points.
Examples: weight loss, staying fit, healthy habits, water intake, calorie needs.
Introduce yourself as "AROGYA" and start by asking: "🌿 How can I help you today?".
Keep answers limited to the **3 most important points** and add **relevant emojis**.
Use markdown formatting for clear structure.
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
    { type: "bot", text: "🌟 **Hello! I'm AROGYA, your health assistant.**\n\nHow can I help you today?" }
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
      setMessages((prev) => [...prev, { type: "bot", text: cache[input] }]);
      setLoading(false);
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `${SYSTEM_INSTRUCTION}\n\nUser: ${input}\n\nAROGYA:`;
      
      const [result] = await Promise.all([model.generateContent(prompt)]);
      const response = result.response?.text() || "⚠️ Sorry, I couldn't generate a response.";
      
      cache[input] = response;
      if (Object.keys(cache).length > CACHE_LIMIT) delete cache[Object.keys(cache)[0]];
      await saveCache();
      
      setMessages((prev) => [...prev, { type: "bot", text: response }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { type: "bot", text: "🚨 Failed to generate a response. Try again." }]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#D4FF00" />
        </TouchableOpacity>
        <Text style={styles.headerText}>🤖 AROGYA - Your Health Bot</Text>
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
          placeholder="Ask me anything about health... 💬"
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
