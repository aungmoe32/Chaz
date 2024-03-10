import { Text, View } from "react-native";
import { Slot, Stack, Tabs, router, useSegments } from "expo-router";
import { NativeWindStyleSheet } from "nativewind";
import { AuthContextProvider, useAuth } from "../ctx/auth";
import { useEffect } from "react";
import { MenuProvider } from "react-native-popup-menu";

import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import NotiContextProvider from "../ctx/useNoti";
import { auth } from "../firebaseConfig";
import { register } from "@videosdk.live/react-native-sdk";
NativeWindStyleSheet.setOutput({
  default: "native",
});

register();

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  // console.log(Constants.expoConfig.extra.eas.projectId);
  // auth.currentUser.getIdToken().then(token => console.log('token : ',token))
  // console.log(auth.currentUser)
  useEffect(() => {
    // console.log('pu',isAuthenticated);
    if (typeof isAuthenticated == "undefined") return;
    const inApp = segments[0] == "(tabs)";
    if (isAuthenticated && !inApp) {
      router.replace("home");
    } else if (isAuthenticated == false) {
      router.replace("signIn");
    }
  }, [isAuthenticated]);

  // return <Slot></Slot>;
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >
      <Stack.Screen
        name="profile"
        options={({ navigation, route }) => ({
          headerShown: true,
        })}
      ></Stack.Screen>
      <Stack.Screen
        name="CallScreen"
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: "",
        })}
      ></Stack.Screen>
    </Stack>
  );
};

export default function Layout() {
  return (
    // <Tabs
    //   screenOptions={{
    //     headerStyle: {
    //       backgroundColor: '#f4511e',
    //     },
    //     headerTintColor: '#fff',
    //     headerTitleStyle: {
    //       fontWeight: 'bold',
    //     },
    //   }}
    // />

    <MenuProvider>
      <StatusBar barStyle="light-content" backgroundColor="white" />
      <NotiContextProvider>
        <AuthContextProvider>
          <MainLayout />
        </AuthContextProvider>
      </NotiContextProvider>
    </MenuProvider>
  );
}
