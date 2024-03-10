import {
  Platform,
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableNativeFeedback,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import Loading from "../components/Loading";
import CustomKeyBoardView from "../components/CustomKeyBoardView";
import { useAuth } from "../ctx/auth";
import { router } from "expo-router";
import { Image } from "expo-image";

import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

export default function SignIn() {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [googleSignInLoading, setGoogleSignInLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();

  const handleSignInWithGoogle = async () => {
    setGoogleSignInLoading(true);
    let response = await signInWithGoogle();
    setGoogleSignInLoading(false);
    // console.log("got user : ", response.data);
    if (!response.success) {
      Alert.alert("Google Sign in", response.message);
    }
  };

  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Enter");
      return;
    }
    setLoading(true);
    let response = await login(emailRef.current, passwordRef.current);
    setLoading(false);
    // console.log("got user : ", response.data);
    if (!response.success) {
      Alert.alert("Sign in", response.message);
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
          Sign In
        </Text>

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
            onPress={handleLogin}
            style={{
              marginBottom: 15,
              backgroundColor: "#007bff",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
            }}
          >
            <Text style={{ textAlign: "center", color: "#fff" }}>Sign in</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{ marginBottom: 10 }}
          onPress={() => router.navigate("signUp")}
        >
          <Text style={{ textAlign: "center", color: "#007bff", padding: 5 }}>
            Sign up
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

        {/* <TouchableOpacity
          onPress={() => signInWithGoogle()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 15,
            backgroundColor: "#db4437",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
          }}
        >
          <Image
            source={require("../assets/google_icon.png")}
            style={{ width: 20, height: 20, marginRight: 10 }}
          />
          <Text style={{ textAlign: "center", color: "#fff" }}>
            Sign in with Google
          </Text>
        </TouchableOpacity> */}
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
              // style={{
              //   width: "100%",
              //   justifyContent: "center",
              //   alignItems: "center",
              // }}
            ></GoogleSigninButton>
            // <Text></Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            router.navigate("forgotPassword");
          }}
        >
          <Text style={{ textAlign: "right", color: "#6c757d", padding: 5 }}>
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>
    </CustomKeyBoardView>
  );
}
