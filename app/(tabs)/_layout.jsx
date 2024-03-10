import { Stack, Tabs, router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import {
  Menu,
  MenuTrigger,
  MenuOption,
  MenuOptions,
} from "react-native-popup-menu";
import { useAuth } from "../../ctx/auth";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

export default function Layout() {
  const { logout, user } = useAuth();
  const handleLogout = async () => {
    await logout();
  };
  // useEffect(()=> {
  //   console.log('tabs')
  // }, [])
  return (
    // <Stack
    //   screenOptions={{
    //   }}
    // />
    <>
      <StatusBar barStyle="light-content" backgroundColor="white" />

      <Tabs
        screenOptions={({ route }) => ({
          headerTitle: (props) => (
            <Text
              className=" text-2xl font-bold"
              style={{
                color: "#007bff",
              }}
            >
              {/* {route.name.toUpperCase()} */}
              ChaZ
            </Text>
          ),
          tabBarIcon: ({ focused, color, size }) => {
            let cr = focused ? "#007bff" : "gray";
            if (route.name === "home") {
              return <AntDesign name="home" size={24} color={cr} />;
            } else if (route.name === "settings") {
              return <AntDesign name="setting" size={24} color={cr} />;
            } else if (route.name === "(settings)") {
              return <AntDesign name="setting" size={24} color={cr} />;
            } else if (route.name === "(chat)") {
              return (
                <Ionicons name="chatbubble-outline" size={24} color={cr} />
              );
            }
          },
          tabBarActiveTintColor: "#007bff",
          tabBarInactiveTintColor: "gray",
          tabBarShowLabel: false,
          // headerShown :false
        })}
      >
        {/* <Tabs.Screen options={{ headerShown: false }} name="(chat)" /> */}

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
            // headerTitle: () => (
            //   <Text className=" text-2xl font-bold">
            //     {route.name.toUpperCase()}
            //   </Text>
            // ),
          })}
        />
      </Tabs>
    </>
  );
}
