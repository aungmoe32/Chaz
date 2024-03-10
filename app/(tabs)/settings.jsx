import { View, Text, Button, TouchableOpacity, Pressable } from "react-native";
import React, { useEffect } from "react";
import { router, useFocusEffect, useNavigation } from "expo-router";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function p1() {
  // const navigation = useNavigation();

  // useFocusEffect(() => {
  //   navigation.getParent().setOptions({
  //     tabBarStyle: { display: "none" }
  //   })
  // });

  // useEffect(() => {
  //   console.log("setting ren");
  //   const unsub = getMessages();
  //   return () => {
  //     console.log('unmount setting');
  //     unsub();
  //   };
  // }, []);

  // const getMessages = () => {
  //   console.log('get messages setting');
  //   let roomId = 'FkWOYlgca0bsp4GhE1bGTsI9wKC3-iHGDQiO7kmgGruFJmjUX6jEwpGH3'
  //   const docRef = doc(db, "rooms", roomId);
  //   const messagesRef = collection(docRef, "messages");
  //   const q = query(messagesRef, orderBy("createdAt", "asc"));

  //   let unsub = onSnapshot(q, (snapshot) => {
  //     let allmessages =[]
  //     snapshot.forEach((doc) => {
  //       // console.log('onsnap', doc.data().text)
  //       // return doc.data();
  //       allmessages.push(doc.data())
  //     });
  //     console.log('got msgs settings', allmessages.length);
  //     // setMessages([...allmessages]);
  //     // setLoading(false);
  //   });
  //   window.unsub = unsub
  //   return unsub;
  // };

  return (
    <View className="flex-1 justify-center items-center">
      <Text>settings</Text>

      {/* <Button title="Green" color={"#ffffff"} className="p-5 border-none bg-white text-black "></Button> */}
      {/* <Pressable >
        <Text>HI</Text>
      </Pressable> */}
      {/* <TouchableOpacity
        onPress={() => {
          router.navigate("profile");
        }}
      >
        <Text className=" p-5 bg-green-300">Navi</Text>
      </TouchableOpacity> */}
    </View>
  );
}
