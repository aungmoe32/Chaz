import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import { getRoomId, sendNotifications } from "../utils/common";
import * as Notifications from "expo-notifications";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import MessageList from "../components/MessageList";
import ChatRoomHeader from "../components/ChatRoomHeader";
import Loading from "../components/Loading";
import { db } from "../firebaseConfig";
import { useAuth } from "../ctx/auth";

export default function chatRoom() {
  const params = useLocalSearchParams();
  const item = JSON.parse(params.item);
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const textRef = useRef("");
  const inputRef = useRef(null);
  // console.log("renderp", loading, messages.length);
  const listRef = useRef(null);

  useEffect(() => {
    scrollDown();
    // showNoti(false)

    return () => {
      // console.log('unmount');
    };
  }, [messages]);

  const showNoti = (v) => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: v,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  };

  const navigation = useNavigation();
  useFocusEffect(() => {
    // console.log('focus room')
    // navigation.getParent().setOptions({
    //   tabBarStyle: { display: "none" },
    // });
  });

  useEffect(() => {
    createRoomIfNotExists();
    const unsub = getMessages();
    const KeyboardDidShow = Keyboard.addListener("keyboardDidShow", scrollDown);
    // console.log('room mt')
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        // console.log("handlerrr", notification);
        const notiRoomId = notification.request.content.data?.roomId;
        const isCall = notification.request.content.data?.isCall;
        const roomId = getRoomId(user?.userId, item?.userId);

        let option = {
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        };
        if (notiRoomId == roomId) {
          option.shouldShowAlert = false;
        } else {
          option.shouldShowAlert = true;
        }
        if (isCall) option.shouldShowAlert = true;
        return option;
      },
    });
    return () => {
      // console.log("unmount room");
      unsub();
      KeyboardDidShow.remove();
      showNoti(true);
    };
  }, []);

  const scrollDown = () => {
    setTimeout(() => {
      if (messages.length > 0)
        listRef?.current?.scrollToIndex({ animated: true, index: 0 });
    }, 50);
  };

  const getMessages = () => {
    // console.log("getmessages");
    let roomId = getRoomId(user?.userId, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    let unsub = onSnapshot(q, (snapshot) => {
      if (snapshot.metadata.fromCache) return;
      let allmessages = [];
      snapshot.forEach((doc) => {
        // console.log('onsnap', doc.data().text)
        // return doc.data();
        allmessages.push(doc.data());
      });
      // console.log("got msgs room", allmessages.length);
      setMessages([...allmessages]);
      setLoading(false);
    });
    return unsub;
  };

  const handleSendMsg = async () => {
    let message = textRef.current.trim();
    if (!message) return;
    try {
      let roomId = getRoomId(user?.userId, item?.userId);
      const docRef = doc(db, "rooms", roomId);
      const messagesRef = collection(docRef, "messages");
      textRef.current = "";
      if (inputRef) inputRef.current.clear();
      const msg = await addDoc(messagesRef, {
        userId: user?.userId,
        text: message,
        profileUrl: user?.profileUrl,
        senderName: user?.username,
        createdAt: Timestamp.fromDate(new Date()),
      });
      sendNotifications(msg.id, roomId);
      // console.log(msg.id, roomId);
      // item.devices.forEach((token) => {
      //   sendPushNotification(token, user.username, message);
      // });
      // console.log(item);
    } catch (error) {
      Alert.alert(error.message);
      // console.log(error.message);
    }
  };

  const createRoomIfNotExists = async () => {
    // console.log('create room' ,user?.userId);
    let roomId = getRoomId(user?.userId, item?.userId);
    try {
      const roomRef = doc(db, "rooms", roomId);
      const docSnap = await getDoc(roomRef);

      if (!docSnap.exists()) {
        await setDoc(doc(db, "rooms", roomId), {
          roomId,
          createdAt: Timestamp.fromDate(new Date()),
        });
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  return (
    <View className="flex-1 ">
      <ChatRoomHeader
        user={item}
        roomId={getRoomId(user?.userId, item?.userId)}
      ></ChatRoomHeader>
      <View className="flex-1 ">
        {loading ? (
          <View className=" flex-1 justify-center  items-center">
            <Loading></Loading>
          </View>
        ) : (
          <MessageList messages={messages} listRef={listRef}></MessageList>
        )}
      </View>
      <View className="bg-white m-3 flex-row p-2 justify-between items-center rounded-full  border border-neutral-300">
        <TextInput
          multiline
          // numberOfLines={5}
          style={{
            maxHeight: 60,
          }}
          ref={inputRef}
          onChangeText={(v) => (textRef.current = v)}
          placeholder="message"
          className=" ml-2  flex-1 "
          placeholderTextColor={"gray"}
        ></TextInput>
        <TouchableOpacity onPress={handleSendMsg} className="rounded-full p-2 ">
          <Ionicons name="send" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
