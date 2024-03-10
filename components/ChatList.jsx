import { View, Text, FlatList, Button } from "react-native";
import React from "react";
import ChatItem from "./ChatItem";
import { router } from "expo-router";

export default function ChatList({ users, onRefresh, refresh, currUser  }) {
  // console.log('flat render ', refresh)
  const renderItem = ({ item, index }) => {
    // console.log('render it.')
    return (
      <ChatItem
        item={item}
        noBorder={index + 1 == users.length}
        index={index}
        currUser={currUser}
      ></ChatItem>
    );
  };


  return (
    <View className=" flex-1  ">
      <FlatList
        data={users}
        initialNumToRender={5}
        onRefresh={onRefresh}
        refreshing={refresh}
        // contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.userId}
        renderItem={renderItem}
      ></FlatList>
    </View>
  );
}
