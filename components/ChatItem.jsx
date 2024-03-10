import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  TouchableHighlight,
  TouchableNativeFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import { router, useNavigation } from "expo-router";
import { getRoomId } from "../utils/common";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import moment from "moment";

export default function ChatItem({ item, noBorder, currUser }) {
  const [latestMsg, setLatestMsg] = useState(null);
  const navigation = useNavigation();
  const openChatRoom = () => {
    // navigation.navigate('chatRoom', {
    //   item : JSON.stringify(item),
    // });
    router.navigate({
      pathname: "chatRoom",
      params: {
        item: JSON.stringify(item),
      },
    });
    // console.log('navigated')
  };
  useEffect(() => {
    const unsub = getLatestMsg();
    return unsub;
  }, []);

  const getLatestMsg = () => {
    let roomId = getRoomId(currUser?.userId, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1));

    let unsub = onSnapshot(q, (snapshot) => {
      let allmessages = snapshot.docs.map((doc) => {
        // console.log('onsnap latest')
        return doc.data();
      });
      // setLoading(false)
      setLatestMsg(allmessages[0]);
    });
    return unsub;
  };

  const renderTime = () => {
    if (latestMsg) {
      let date = new Date(latestMsg.createdAt.seconds * 1000);
      return moment(date).format("MMM DD");
    } else {
      return "";
    }
  };

  const renderLatestMsg = () => {
    if (latestMsg) {
      let msg = latestMsg.text;
      if (msg.length > 15) msg = msg.slice(0, 15) + "...";

      if (currUser?.userId == latestMsg?.userId) {
        return "You : " + msg;
      } else return msg;
    } else {
      return "Say hi 👋";
    }
  };

  return (
    // <TouchableOpacity
    //   onPress={openChatRoom}
    //   className={`flex-row p-2 justify-between px-5 `}
    //   // ${
    //   //   noBorder ? "" : "border-b border-b-gray-300"
    //   // }
    // >
    <TouchableNativeFeedback
      onPress={openChatRoom}
      background={TouchableNativeFeedback.Ripple("gray", false)}
    >
      <View className={`flex-row p-2 justify-between px-5 `}>
        <Image
          style={{
            width: hp(8),
            height: hp(8),
            borderRadius: 100,
          }}
          source={{ uri: item?.profileUrl }}
          placeholder={require("../assets/images/user.png")}
          transition={200}
          // source={require("../assets/images/user.png")}
        ></Image>
        <View className="flex-1    flex-row ml-3">
          <View className="flex-1     ">
            <Text className="font-bold text-xl">{item?.username}</Text>
            <Text className=" text-gray-500">{renderLatestMsg()}</Text>
          </View>
          <View className=" justify-end    ">
            <Text className=" text-gray-400">{renderTime()}</Text>
          </View>
        </View>
      </View>
    </TouchableNativeFeedback>
    // </TouchableOpacity>
  );
}
