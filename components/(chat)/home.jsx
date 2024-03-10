import {
  Platform,
  StyleSheet,
  View,
  Text,
  Button,
  StatusBar,
  Alert,
} from "react-native";
import {
  Stack,
  useNavigation,
  router,
  Link,
  useLocalSearchParams,
  useFocusEffect,
} from "expo-router";
import { useEffect, useState } from "react";
import { usersRef } from "../../firebaseConfig";
import { getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../../ctx/auth";

import Loading from "../../components/Loading";
import ChatList from "../../components/ChatList";
// import LottieView from 'lottie-react-native'
// import Loading from "../../components/Loading";

export default function home({ route }) {
  const { logout, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const param = useLocalSearchParams();
  // console.log('home',refresh)

  const navigation = useNavigation();
  useFocusEffect(() => {
    navigation.getParent().setOptions({
      tabBarStyle: { display: "flex" },
    });
  });

  useEffect(() => {
    // console.log("getusers");
    if (refresh) {
      if (user?.uid) {
        getUsers();
        // getUsersDum();
      }
    }
  }, [refresh]);

  const onRefresh = () => {
    setRefresh(true);
  };

  const getUsersDum = async () => {
    return fetch("https://dummyjson.com/users")
      .then((res) => res.json())
      .then((data) => {
        console.log("gotusers");

        setRefresh(false);
        setUsers(data.users);
      });
    // .then(console.log)
  };

  const getUsers = async () => {
    const q = query(usersRef, where("userId", "!=", user?.uid));
    try {
      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data() });
      });
      setUsers(data);
      setRefresh(false);
      // console.log('got data' , data)
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handleLogout = async () => {
    await logout();
  };
  // console.log('home : ', user)
  return (
    <View className=" justify-center bg-white  flex-1">
      {users.length > 0 ? (
        <>
          <ChatList
            users={users}
            currUser={user}
            refresh={refresh}
            onRefresh={onRefresh}
          ></ChatList>
        </>
      ) : (
        <View className="  items-center">
          <Loading></Loading>
        </View>
      )}
    </View>
  );
}
