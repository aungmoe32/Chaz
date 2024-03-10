import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, router } from "expo-router";
import { Image } from "expo-image";
import { Entypo, Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { HeaderBackButton } from "@react-navigation/elements";
export default function ChatRoomHeader({ user, roomId }) {
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        title: "",
        // headerBackButtonMenuEnabled: true,
        headerBackVisible: true,
        headerLeft: () => (
          <View className="flex-row justify-center items-center ">
            <Image
              style={{
                width: hp(5),
                height: hp(5),
                borderRadius: 100,
              }}
              source={{ uri: user?.profileUrl }}
              placeholder={require("../assets/images/user.png")}
              transition={200}
            ></Image>
            <Text style={{ fontSize: hp(2.2) }} className="ml-2">
              {user?.username}
            </Text>
          </View>
        ),
        headerRight: () => (
          <View className="flex-row mx-2 justify-center items-center ">
            <TouchableOpacity
              onPress={() => {
                router.navigate({
                  pathname: "CallScreen",
                  params: {
                    roomId: roomId,
                    user: JSON.stringify(user),
                  },
                });
              }}
            >
              <Entypo name="phone" size={24} color="#007bff" />
            </TouchableOpacity>
          </View>
        ),
      }}
    />
  );
}
