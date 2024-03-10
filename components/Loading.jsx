import { View, Text } from "react-native";
import React, { useMemo } from "react";
import LottieView from "lottie-react-native";

export default function Loading({ size }) {
  return (
    <View
      style={{
        height: size ? size : 120,
        aspectRatio: 1,
        // backgroundColor: "green",
        // padding: 0,
      }}
    >
      <LottieView
        style={{
          flex: 1,
          height: size ? size : 120,
          color: "green",
          // backgroundColor: "red",
          // padding: 0,
        }}
        source={require("../assets/loading.json")}
        autoPlay
        loop
      ></LottieView>
    </View>
  );
}
