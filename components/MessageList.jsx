import { View, Text, ScrollView, FlatList } from "react-native";
import React, { useEffect, useRef, useState } from "react";
// import MessageItem from "./MessageItem";
import { useAuth } from "../ctx/auth";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function MessageList({ messages, listRef }) {
  const { user } = useAuth();

  const MessageItem = ({ item, index }) => {
    const mine = user.userId == item.userId;
    return (
      <View className=" mt-2 mx-5">
        {mine ? (
          <View className="flex-row justify-end">
            <View className="bg-[#007bff] border border-neutral-200 rounded-2xl px-3 py-2">
              <Text className="text-white" style={{ fontSize: hp(2) }}>
                {item.text}
              </Text>
            </View>
          </View>
        ) : (
          <View className="flex-row justify-start">
            <View className=" bg-white  border border-neutral-200 rounded-2xl px-3 py-2">
              <Text style={{ fontSize: hp(2) }}>{item.text}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className=" flex-1  ">
      <FlatList
        inverted
        ref={listRef}
        data={messages}
        // data={[...messages].reverse()}
        // initialNumToRender={5}
        // onRefresh={onRefresh}
        // refreshing={refresh}
        // contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
        // ItemSeparatorComponent={separator}
        showsVerticalScrollIndicator={false}
        // keyExtractor={(item) => item.userId}
        renderItem={MessageItem}
      ></FlatList>
    </View>
  );
}
