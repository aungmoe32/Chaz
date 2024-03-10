import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ios = Platform.OS == "ios";
export default function CustomKeyBoardView({ children }) {
  return (
    <KeyboardAvoidingView
      behavior={ios ? "padding" : "height"}
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
      // className = " flex-1 flex-row justify-center"
    >
      <ScrollView
        style={{
          // flex: 1 ,
        //   backgroundColor: "blue",
        }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
          {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
