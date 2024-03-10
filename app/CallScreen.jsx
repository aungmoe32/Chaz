import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  FlatList,
  Touchable,
  Alert,
} from "react-native";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
  MediaStream,
  RTCView,
} from "@videosdk.live/react-native-sdk";
import { createMeeting, token } from "../utils/api";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  deleteField,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { FontAwesome } from "@expo/vector-icons";
import { sendPushNotification } from "../ctx/useNoti";
import { auth, db } from "../firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { sendCallNoti } from "../utils/common";
import { useAuth } from "../ctx/auth";

const Button = ({ onPress, buttonText, backgroundColor }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        padding: 12,
        borderRadius: 4,
      }}
    >
      <Text style={{ color: "white", fontSize: 12 }}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

function ParticipantView({ participantId }) {
  const { webcamStream, webcamOn } = useParticipant(participantId);

  return webcamOn && webcamStream ? (
    <>
      <RTCView
        streamURL={new MediaStream([webcamStream?.track]).toURL()}
        objectFit={"cover"}
        style={{
          height: 300,
          marginVertical: 8,
          marginHorizontal: 8,
          // borderRadius: 8,
          // borderWidth: 9,
        }}
      />
    </>
  ) : (
    <View
      style={{
        backgroundColor: "grey",
        height: 300,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 8,
        marginHorizontal: 8,
        // borderRadius: 8,
      }}
    >
      <Text style={{ fontSize: 16 }}>NO MEDIA</Text>
    </View>
  );
}

function ParticipantList({ participants }) {
  return participants.length > 0 ? (
    <FlatList
      data={participants}
      renderItem={({ item }) => {
        return <ParticipantView participantId={item} />;
      }}
    />
  ) : (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F6F6FF",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 20 }}>Press Join button</Text>
    </View>
  );
}
function ControlsContainer() {
  const { join, leave, toggleWebcam, toggleMic, localWebcamOn, localMicOn } =
    useMeeting({ onMeetingJoined, onMeetingLeft });
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [hideTools, setHideTools] = useState(true);
  function onMeetingJoined() {
    // console.log("onMeetingJoined");
    setHideTools(false);
    setIsInMeeting(true);
  }

  function onMeetingLeft() {
    // console.log("onMeetingLeft");
    setHideTools(false);
    setIsInMeeting(false);
  }
  return (
    <View
      style={{
        padding: 24,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      {hideTools ? null : isInMeeting ? (
        <Button
          onPress={() => {
            setHideTools(true);
            leave();
          }}
          buttonText={"Leave"}
          backgroundColor={"#FF0000"}
        />
      ) : (
        <Button
          onPress={() => {
            setHideTools(true);
            join();
          }}
          buttonText={"Join"}
          backgroundColor={"#1178F8"}
        />
      )}
      {/* {isInMeeting ? (
        <Button
          onPress={() => {
            leave();
          }}
          buttonText={"Leave"}
          backgroundColor={"#FF0000"}
        />
      ) : (
        <Button
          onPress={() => {
            join();
          }}
          buttonText={"Join"}
          backgroundColor={"#1178F8"}
        />
      )} */}

      <TouchableOpacity
        onPress={() => {
          toggleMic();
        }}
      >
        {localMicOn ? (
          <FontAwesome name="microphone" size={30} color="black" />
        ) : (
          <FontAwesome name="microphone-slash" size={30} color="black" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          toggleWebcam();
        }}
      >
        {localWebcamOn ? (
          <MaterialCommunityIcons name="webcam" size={30} color="black" />
        ) : (
          <MaterialCommunityIcons name="webcam-off" size={30} color="black" />
        )}
      </TouchableOpacity>
    </View>
  );
}

function MeetingView() {
  // Get `participants` from useMeeting Hook

  const { participants, leave, meetingId } = useMeeting({ onEntryRequested });
  const participantsArrId = [...participants.keys()];
  // const params = useLocalSearchParams();
  // const user = JSON.parse(params.user);
  // const navigation = useNavigation();

  useEffect(() => {
    // navigation.addListener("beforeRemove", (e) => {
    //   e.preventDefault();
    // });
    return () => {
      // console.log("unmount leaved");
      leave();
    };
  }, []);
  function onEntryRequested(data) {
    const { participantId, name, allow, deny } = data;

    console.log(`${name} ${participantId} requested to join the meeting.`);
    Alert.alert(
      "join",
      `${name} ${participantId} requested to join the meeting.`
    );

    // // If you want to allow the entry request
    // allow();

    // // if you want to deny the entry request
    // deny();
  }

  return (
    <View style={{ flex: 1 }}>
      {/* {meetingId ? (
        <Text style={{ fontSize: 18, padding: 12 }}>
          Meeting Id : {meetingId}
        </Text>
      ) : null} */}
      <ParticipantList participants={participantsArrId} />
      <ControlsContainer />
    </View>
  );
}

export default function App() {
  const [meetingId, setMeetingId] = useState(null);
  const [isCaller, setIsCaller] = useState(false);

  const params = useLocalSearchParams();
  const { roomId } = params;
  // const user = JSON.parse(params.user);
  const auth = useAuth();

  const getMeetingId = async (id) => {
    if (!token) {
      console.log("PLEASE PROVIDE TOKEN IN api.js FROM app.videosdk.live");
    }
    let meetingId;
    if (id) {
      meetingId = id;
    } else {
      // caller
      setIsCaller(true);
      // console.log("setIscaller");
      meetingId = await createMeeting({ token });
      const roomRef = doc(db, "rooms", roomId);
      await setDoc(roomRef, { meetingId: meetingId }, { merge: true });
    }
    // console.log("setting id", meetingId);
    setMeetingId(meetingId);
  };

  const initMeeting = async () => {
    const roomRef = doc(db, "rooms", roomId);
    // console.log("roomref", roomId);
    const docSnap = await getDoc(roomRef);

    if (!docSnap.exists()) {
      console.log("doc not exist");
      return;
    }
    // console.log("Document data:", docSnap.data());
    let room = docSnap.data();
    if (room.meetingId) {
      console.log("exist meetingid", room.meetingId);
      await getMeetingId(room.meetingId);
    } else {
      await getMeetingId();
    }
  };

  // const IsCaller = async () => {
  //   const roomRef = doc(db, "rooms", roomId);
  //   const docSnap = await getDoc(roomRef);

  //   let room = docSnap.data();
  //   return room.callee == user.userId;
  // };
  // const deleteMeetingIfCaller = async () => {
  //   let iscaller = await IsCaller();
  //   console.log("iscaller", iscaller);
  //   if (!iscaller) return;
  //   const roomRef = doc(db, "rooms", roomId);
  //   updateDoc(roomRef, { meetingId: deleteField() });
  // };

  // const updateTotalInRoom = async () => {
  //   const roomRef = doc(db, "rooms", roomId);
  //   const docSnap = await getDoc(roomRef);
  //   const room = docSnap.data();
  //   await setDoc(
  //     roomRef,
  //     { totalInRoom: room.totalInRoom - 1 },
  //     { merge: true }
  //   );
  // };

  useEffect(() => {
    try {
      initMeeting();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    return () => {
      // deleteMeetingIfCaller()
      // updateTotalInRoom();
    };
  }, []);

  return meetingId ? (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F6FF" }}>
      <MeetingProvider
        config={{
          meetingId,
          micEnabled: false,
          webcamEnabled: false,
          name: JSON.stringify({
            userId: auth?.user?.userId,
            roomId: roomId,
          }),
          notification: {
            title: "ChaZ",
            message: "🔴 Video Call is running...",
          },
        }}
        joinWithoutUserInteraction={true}
        token={token}
      >
        <MeetingView />
      </MeetingProvider>
    </SafeAreaView>
  ) : (
    // <JoinScreen
    //   getMeetingId={() => {
    //     getMeetingId();
    //   }}
    // />
    <View className="flex-1 justify-center items-center">
      <Text>Connecting...</Text>
    </View>
  );
}
