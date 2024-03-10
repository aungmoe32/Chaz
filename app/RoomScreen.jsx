//RoomScreen.js

import React, { useEffect, useState } from "react";
import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";

import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  deleteField,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";

export default function RoomScreen() {
  const { roomId } = useLocalSearchParams();

  const onCallOrJoin = (screen) => {
    if (roomId.length > 0) {
      //   console.log(screen);
      router.navigate({
        pathname: screen,
        params: {
          roomId: roomId,
        },
      });
      //   router.navigate("call");
    }
  };

  //checks if room is existing
  const checkMeeting = async () => {
    if (roomId) {
      const roomRef = doc(db, "rooms", roomId);
      const roomSnapshot = await getDoc(roomRef);

      // console.log(roomSnapshot.data());

      if (!roomSnapshot.exists() || roomId === "") {
        // console.log(`Room ${roomId} does not exist.`);
        Alert.alert("Wait for your instructor to start the meeting.");
        return;
      } else {
        onCallOrJoin("JoinScreen");
      }
    } else {
      Alert.alert("Provide a valid Room ID.");
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <View className="gap-y-3 mx-5 mt-5">
        <TouchableOpacity
          className="bg-sky-300 p-2  rounded-md"
          onPress={() => onCallOrJoin("CallScreen")}
        >
          <Text className="color-black text-center text-xl font-bold ">
            Start meeting
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-sky-300 p-2 rounded-md"
          onPress={() => checkMeeting()}
        >
          <Text className="color-black text-center text-xl font-bold ">
            Join meeting
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
