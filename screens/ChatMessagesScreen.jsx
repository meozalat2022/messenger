import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";

const ChatMessagesScreen = () => {
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmojiSelector = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
      <ScrollView></ScrollView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 25,
        }}
      >
        <Entypo
          onPress={handleEmojiSelector}
          style={{ marginRight: 5 }}
          name="emoji-happy"
          size={24}
          color="grey"
        />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type Your Message...."
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 8,
            gap: 7,
          }}
        >
          <Entypo name="camera" size={24} color="grey" />
          <Feather name="mic" size={24} color="grey" />
        </View>

        <Pressable
          style={{
            backgroundColor: "#007bff",
            paddingVertical: 4,
            borderRadius: 10,
            paddingHorizontal: 15,
          }}
        >
          <Text style={{ color: "white" }}>Send</Text>
        </Pressable>
      </View>
      {showEmojiSelector && (
        <EmojiSelector
          style={{ height: 250 }}
          onEmojiSelected={(emoji) => {
            setMessage((prev) => prev + emoji);
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({});
