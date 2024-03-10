import {
  Platform,
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Stack, useNavigation, router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import Loading from "../components/Loading";
import CustomKeyBoardView from "../components/CustomKeyBoardView";
import { useAuth } from "../ctx/auth";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
export default function SignUp() {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const usernameRef = useRef("");
  const profileRef = useRef("");
  const [loading, setLoading] = useState(false);

  const [googleSignInLoading, setGoogleSignInLoading] = useState(false);
  const { register, signInWithGoogle } = useAuth();

  const handleSignInWithGoogle = async () => {
    setGoogleSignInLoading(true);
    let response = await signInWithGoogle();
    setGoogleSignInLoading(false);
    console.log("got user : ", response.data);
    if (!response.success) {
      Alert.alert("Google Sign in", response.message);
    }
  };

  const handleSignUp = async () => {
    if (
      !emailRef.current ||
      !passwordRef.current ||
      !usernameRef.current ||
      !profileRef.current
    ) {
      Alert.alert("Enter");
      return;
    }

    setLoading(true);
    let response = await register(
      emailRef.current,
      passwordRef.current,
      usernameRef.current,
      profileRef.current
    );
    setLoading(false);
    // console.log("got user : ", response.data);
    if (!response.success) {
      Alert.alert("Sign Up", response.message);
    }
  };

  return (
    <CustomKeyBoardView>
      <View
        style={{
          marginHorizontal: wp(5),
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: 20,
            color: "#333",
          }}
        >
          Sign Up
        </Text>

        <TextInput
          onChangeText={(v) => (usernameRef.current = v)}
          placeholder="User Name"
          style={{
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 5,
            marginBottom: 15,
            borderWidth: 1,
            borderColor: "#ddd",
          }}
          placeholderTextColor={"gray"}
        />

        <TextInput
          onChangeText={(v) => (emailRef.current = v)}
          placeholder="Email Address"
          style={{
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 5,
            marginBottom: 15,
            borderWidth: 1,
            borderColor: "#ddd",
          }}
          placeholderTextColor={"gray"}
        />

        <TextInput
          onChangeText={(v) => (passwordRef.current = v)}
          placeholder="Password"
          style={{
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 5,
            marginBottom: 15,
            borderWidth: 1,
            borderColor: "#ddd",
          }}
          secureTextEntry
          placeholderTextColor={"gray"}
        />

        <TextInput
          onChangeText={(v) => (profileRef.current = v)}
          placeholder="Profile Url"
          style={{
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 5,
            marginBottom: 15,
            borderWidth: 1,
            borderColor: "#ddd",
          }}
          placeholderTextColor={"gray"}
        />

        {loading ? (
          <View
            style={{
              justifyContent: "center",
              flexDirection: "row",
              marginBottom: 15,
            }}
          >
            <Loading />
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleSignUp}
            style={{
              marginBottom: 15,
              backgroundColor: "#007bff",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
            }}
          >
            <Text style={{ textAlign: "center", color: "#fff" }}>Sign Up</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{ marginBottom: 10 }}
          onPress={() => router.navigate("signIn")}
        >
          <Text style={{ textAlign: "center", color: "#007bff", padding: 5 }}>
            Sign In
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "#ddd" }} />
          <View>
            <Text style={{ width: 50, textAlign: "center", color: "#6c757d" }}>
              OR
            </Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: "#ddd" }} />
        </View>
        <View className=" items-center">
          {googleSignInLoading ? (
            <View
              style={{
                justifyContent: "center",
                flexDirection: "row",
                marginBottom: 15,
              }}
            >
              <Loading />
            </View>
          ) : (
            <GoogleSigninButton
              onPress={handleSignInWithGoogle}
            ></GoogleSigninButton>
            // <Text></Text>
          )}
        </View>
      </View>
    </CustomKeyBoardView>
  );
}
