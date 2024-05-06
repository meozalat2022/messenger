import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
            Sign In
          </Text>
          <Text style={{ marginTop: 15, fontSize: 17, fontWeight: "600" }}>
            Sign In To Your Account
          </Text>
        </View>
        <View style={{ marginTop: 50 }}>
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
          <Pressable
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
              Login
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Register")}
            style={{ marginTop: 10 }}
          >
            <Text style={{ textAlign: "center", color: "grey", fontSize: 16 }}>
              Don't have an account ? Sign up
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
