import { View, Text, Touchable, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, router, useNavigation } from "expo-router";

import { Entypo } from "@expo/vector-icons";
import {
  Menu,
  MenuTrigger,
  MenuOption,
  MenuOptions,
} from "react-native-popup-menu";
import { useAuth } from "../../ctx/auth";
export default function _layout() {
  const navigation = useNavigation();
  const { logout, user } = useAuth();
  const handleLogout = async () => {
    await logout();
  };
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        // animation : 'slide_from_bottom',
        animation: "none",
        // animationDuration : 5000
      }}
    >
      <Stack.Screen
        name="home"
        options={({ navigation, route }) => ({
          headerRight: () => (
            <Menu>
              <MenuTrigger
                customStyles={{
                  TriggerTouchableComponent: TouchableOpacity,
                  triggerTouchable: {
                    // underlayColor: 'darkblue',
                    // activeOpacity: 70,
                    // borderRadius : 5
                  },
                }}
              >
                {/* <Button title="tools" /> */}
                <Entypo
                  name="dots-three-vertical"
                  size={24}
                  color="#007bff"
                  style={{ padding: 7 }}
                />
              </MenuTrigger>
              <MenuOptions>
                <MenuOption
                  className="p-3"
                  onSelect={() => router.navigate("profile")}
                  text="Profile"
                />
                <MenuOption className="p-3" onSelect={handleLogout}>
                  <Text style={{ color: "red" }}>Logout</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          ),
          headerTitle: () => (
            <Text className=" text-2xl font-bold">
              {route.name.toUpperCase()}
            </Text>
          ),
        })}
      />
    </Stack>
  );
}
