import React from "react";
import { TouchableOpacity, Text, Alert } from "react-native";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: "YOUR_WEB_CLIENT_ID_HERE", // From Firebase Console
});

const signInWithGoogle = async () => {
  try {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  } catch (error) {
    Alert.alert("Sign in error", error.message);
  }
};

const GoogleLogin = () => {
  return (
    <TouchableOpacity
      onPress={() => signInWithGoogle()}
      style={{
        marginBottom: 15,
        backgroundColor: "#db4437",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
      }}
    >
      <Text style={{ textAlign: "center", color: "#fff" }}>
        Sign in with Google
      </Text>
    </TouchableOpacity>
  );
};

export default GoogleLogin;
