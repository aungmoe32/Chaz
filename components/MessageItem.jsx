import { View, Text } from "react-native";
import React from "react";
import { useAuth } from "../ctx/auth";

export default function MessageItem({ item, index }) {
  return (
    <View>
      {/* <Text>sender {user.username}</Text> */}
      <Text>{item.text}</Text>
    </View>
  );
}
