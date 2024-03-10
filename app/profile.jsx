import {
  View,
  Text,
  Button,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router, useFocusEffect, useNavigation } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useAuth } from "../ctx/auth";
import { Image } from "expo-image";

import Loading from "../components/Loading";

export default function profile() {
  // const navigation = useNavigation();

  const { user } = useAuth();
  // const emailRef = useRef("");
  const usernameRef = useRef("");
  const profileUrlRef = useRef("");
  const usernameInputRef = useRef(null);
  const pfUrlInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // console.log("mount profile");
    // usernameInputRef.current.value = user?.username;
    // if(!user) return
    getProfile();
    return () => {
      // console.log("unmount");
    };
  }, []);

  const getProfile = async () => {
    const docRef = doc(db, "users", user?.uid);
    try {
      const docSnap = await getDoc(docRef);
      let pf = docSnap.data();

      usernameInputRef?.current?.setNativeProps({
        text: pf?.username,
      });
      pfUrlInputRef?.current?.setNativeProps({
        text: pf?.profileUrl,
      });
      usernameRef.current = pf?.username;
      profileUrlRef.current = pf?.profileUrl;
      setProfile(pf);
      // console.log(pf);
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    const docRef = doc(db, "users", user.uid);
    try {
      const docSnap = await setDoc(
        docRef,
        { username: usernameRef.current, profileUrl: profileUrlRef.current },
        { merge: true }
      );
      getProfile();
      Alert.alert("Profile updated");
      // alert("Profile updated");
    } catch (error) {
      Alert.alert(error.message);
    }

    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
      <View
        style={{
          alignItems: "center",
          marginBottom: 20,
          backgroundColor: "white",
        }}
      >
        <Image
          style={{
            width: wp(30),
            aspectRatio: 1,
            borderRadius: wp(15),
            // borderWidth: 3,
            // borderColor: "#007bff",
          }}
          source={{ uri: profile?.profileUrl || "../assets/images/user.png" }}
          transition={100}
        />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 10,
          }}
        >
          Edit Profile
        </Text>

        <Text style={{ fontWeight: "bold", color: "#333", marginBottom: 5 }}>
          Email
        </Text>
        <TextInput
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
          editable={false}
          value={user?.email}
        />

        <Text style={{ fontWeight: "bold", color: "#333", marginBottom: 5 }}>
          Username
        </Text>
        <TextInput
          onChangeText={(v) => (usernameRef.current = v)}
          ref={usernameInputRef}
          placeholder="Username"
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

        <Text style={{ fontWeight: "bold", color: "#333", marginBottom: 5 }}>
          Profile Url
        </Text>
        <TextInput
          onChangeText={(v) => (profileUrlRef.current = v)}
          ref={pfUrlInputRef}
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
          <View style={{ alignItems: "center", marginBottom: 15 }}>
            <Loading />
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: "#007bff",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <Text style={{ color: "#fff" }}>Submit</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
