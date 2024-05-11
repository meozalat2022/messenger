import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useState, useContext } from "react";
import { UserType } from "../UserContext";

const User = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);
  const handleFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const res = await fetch("http://192.168.1.45:8000/fiend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });

      if (res.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log("Error occurred", error);
    }
  };
  return (
    <Pressable
      style={{ flexDirection: "row", alignItems: "center", margin: 10 }}
    >
      <View>
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            resizeMode: "cover",
          }}
          source={{ uri: item.image }}
        />
      </View>

      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item?.name}</Text>
        <Text style={{ marginTop: 4, color: "grey" }}>{item?.email}</Text>
      </View>
      <Pressable
        onPress={() => handleFriendRequest(userId, item._id)}
        style={{
          backgroundColor: "#567189",
          padding: 10,
          borderRadius: 6,
          width: 105,
        }}
      >
        <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
          Add Friend
        </Text>
      </Pressable>
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({});
