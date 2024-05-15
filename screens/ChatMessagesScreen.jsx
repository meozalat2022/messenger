import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useContext, useState, useLayoutEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
const ChatMessagesScreen = () => {
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [recipientDetails, setRecipientDetails] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const { userId, setUserId } = useContext(UserType);
  const route = useRoute();
  const navigation = useNavigation();

  const { recipientId } = route.params;
  const handleEmojiSelector = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  useEffect(() => {
    const fetchRecipientDetails = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.4:8000/user/${recipientId}`
        );

        const data = await response.json();
        setRecipientDetails(data);
      } catch (error) {
        console.log("error retrieving data", error);
      }
    };

    fetchRecipientDetails();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.4:8000/messages/${userId}/${recipientId}`
        );

        const data = await response.json();

        if (response.ok) {
          setMessages(data);
        }
      } catch (error) {
        console.log("Error fetching messages");
      }
    };

    fetchMessages();
  }, []);

  console.log(messages);
  const handleSend = async (messageType, imageUri) => {
    console.log("messages", message);
    try {
      const formData = new FormData();

      formData.append("senderId", userId);
      formData.append("recipientId", recipientId);

      // check the message type

      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("message", message);
      }

      const response = await fetch("http://192.168.1.4:8000/messages", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("");
        setSelectedImage("");
      }
    } catch (error) {
      console.log("error sending message", error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back-sharp"
            size={24}
            color="black"
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: recipientDetails?.image }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                resizeMode: "cover",
              }}
            />
            <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
              {recipientDetails?.name}
            </Text>
          </View>
        </View>
      ),
    });
  }, [recipientDetails]);
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
      <ScrollView>
        {messages.map((item, index) => {
          if (item?.messageType === "text") {
            return (
              <Pressable
                style={[
                  item?.senderId._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        margin: 10,
                        padding: 8,
                        maxWidth: "68%",
                        borderRadius: 7,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        margin: 10,
                        padding: 8,
                        maxWidth: "68%",
                        borderRadius: 7,
                      },
                ]}
              >
                <Text>{item?.message}</Text>
              </Pressable>
            );
          }
        })}
      </ScrollView>
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
          onPress={() => handleSend("text")}
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
