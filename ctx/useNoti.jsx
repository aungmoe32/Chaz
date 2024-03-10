import { useState, useEffect, useRef, useContext, createContext } from "react";
import { Text, View, Button, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { router } from "expo-router";
import { getRoomId } from "../utils/common";

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    // console.log('handle', notification)
    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    };
  },
});

// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
export async function sendPushNotification(expoPushToken, title, body) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: title,
    body: body,
    // data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
      //   projectId: "604452ec-63be-492c-8e34-c6ec5509a10f",
    });
    // console.log(token);
  } else {
    alert("Must use physical device for Push Notifications ");
  }

  return token.data;
}

export const NotiContext = createContext();

export default function NotiContextProvider({ children }) {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  // console.log("useNoti render");

  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (lastNotificationResponse) {
      // console.log("last : ", lastNotificationResponse);

      setTimeout(() => {
        let noti = lastNotificationResponse.notification;
        let isCall = noti?.request?.content?.data?.isCall;
        if (isCall) {
          let roomId = noti?.request?.content?.data?.roomId;
          router.navigate({
            pathname: "CallScreen",
            params: {
              roomId: roomId,
              // user: null,
            },
          });
        } else {
          let item = noti?.request?.content?.data?.sender;
          if (!item) return;
          router.navigate({
            pathname: "chatRoom",
            params: { item: JSON.stringify(item) },
          });
        }
      }, 0);
      // console.log("pushed ");
    }
  }, [lastNotificationResponse]);

  useEffect(() => {
    if (Platform.OS == "web") return;

    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // Notifications.getLastNotificationResponseAsync().then((response) => {
    //   console.log("last", response);
    // });

    // Notifications.getLastNotificationResponseAsync().then((response) => {
    //   // if (!isMounted || !response?.notification) {
    //   //   return;
    //   // }
    //   console.log("last  : ", response?.notification);
    // });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // console.log(notification.request.content.data?.roomId)
        // console.log('received')
        setNotification(notification);
      });

    // responseListener.current =
    //   Notifications.addNotificationResponseReceivedListener((response) => {
    //     // tap
    //     console.log("tap", response);
    //     router.replace('profile')
    //   });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      // Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NotiContext.Provider value={{ notification, expoPushToken }}>
      {children}
    </NotiContext.Provider>
  );
}

export const useNoti = () => {
  const value = useContext(NotiContext);
  if (!value) {
    throw new Error("useNoti must be wrapped in a <NotiContextProvider />");
  }

  return value;
};
