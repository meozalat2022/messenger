import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");

  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
      image: image,
    };

    // send a POST  request to the backend API to register the user
    axios
      .post("http://192.168.1.7:8000/register", user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registration successful",
          "You have been registered Successfully"
        );
        setName("");
        setEmail("");
        setPassword("");
        setImage("");
      })
      .catch((error) => {
        Alert.alert(
          "Registration Error",
          "An error occurred while registering"
        );
        console.log("registration failed", error);
      });
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        alignItems: "center",
      }}
    >
      <KeyboardAvoidingView>
        <View
          style={{
            marginTop: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#4a55a2", fontSize: 17, fontWeight: "600" }}>
            Register
          </Text>
          <Text style={{ marginTop: 15, fontSize: 17, fontWeight: "600" }}>
            Register Your Account
          </Text>
        </View>
        <View style={{ marginTop: 50 }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "grey" }}>
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{
                borderBottomColor: "grey",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
                // height: 40,
                fontSize: 18,
              }}
              placeholder="enter your Name"
              placeholderTextColor={"black"}
            />
          </View>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "grey" }}>
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                borderBottomColor: "grey",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
                // height: 40,
                fontSize: 18,
              }}
              placeholder="enter your email"
              placeholderTextColor={"black"}
            />
          </View>

          <View>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "grey" }}>
              Password
            </Text>
            <TextInput
              value={password}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              style={{
                borderBottomColor: "grey",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
                // height: 40,
                fontSize: 18,
              }}
              placeholder="enter your password"
              placeholderTextColor={"black"}
            />
          </View>

          <View>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "grey" }}>
              Image
            </Text>
            <TextInput
              value={image}
              onChangeText={(text) => setImage(text)}
              style={{
                borderBottomColor: "grey",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
                // height: 40,
                fontSize: 18,
              }}
              placeholder="enter your Image"
              placeholderTextColor={"black"}
            />
          </View>
          <Pressable
            onPress={handleRegister}
            style={{
              width: 200,
              backgroundColor: "#4a55a2",
              padding: 15,
              marginTop: 50,
              marginLeft: "auto",
              marginRight: "auto",
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Register
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ marginTop: 10 }}
          >
            <Text style={{ textAlign: "center", color: "grey", fontSize: 16 }}>
              Already Have an account ? Login
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
