import React, { useState, useEffect } from "react";
import { Alert, View } from "react-native";

import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from "react-native-webrtc";

import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  deleteField,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

import CallActionBox from "../components/CallActionBox";
import { db } from "../firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  //   iceCandidatePoolSize: 10,
};

export default function CallScreen() {
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [cachedLocalPC, setCachedLocalPC] = useState();
  const [unsubs, setUnsubs] = useState([]);

  const { roomId } = useLocalSearchParams();

  const [isMuted, setIsMuted] = useState(false);
  const [isOffCam, setIsOffCam] = useState(false);

  console.log(roomId);

  useEffect(() => {
    console.log("mount call");
    startLocalStream();
  }, []);

  useEffect(() => {
    if (localStream && roomId) {
      startCall(roomId);
    }

    return () => {
      if (!localStream) {
        console.log("unmount call ", unsubs);
        unsubs.forEach((unsub) => unsub());
      }
    };
  }, [localStream, roomId]);

  //End call button
  async function endCall() {
    if (cachedLocalPC) {
      const senders = cachedLocalPC.getSenders();
      senders.forEach((sender) => {
        cachedLocalPC.removeTrack(sender);
      });
      cachedLocalPC.close();
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, { answer: deleteField() });

    const callerCandidatesCollection = collection(roomRef, "callerCandidates");
    // await deleteDoc(callerCandidatesCollection);
    const callerCandidatesSnapshot = await getDocs(callerCandidatesCollection);
    callerCandidatesSnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
      //   console.log(doc.ref);
    });

    setLocalStream();
    setRemoteStream(); // set remoteStream to null or empty when callee leaves the call
    setCachedLocalPC();
    // cleanup
    // setScreen(screens.ROOM); //go back to room screen
    // router.navigate("RoomScreen");
    router.back();
  }

  //start local webcam on your device
  const startLocalStream = async () => {
    // isFront will determine if the initial camera should face user or environment
    const isFront = true;
    const devices = await mediaDevices.enumerateDevices();

    const facing = isFront ? "front" : "environment";
    const videoSourceId = devices.find(
      (device) => device.kind === "videoinput" && device.facing === facing
    );
    const facingMode = isFront ? "user" : "environment";
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 500, // Provide your own width, height and frame rate here
          minHeight: 300,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
      },
    };
    const newStream = await mediaDevices.getUserMedia(constraints);
    setLocalStream(newStream);
  };

  const startCall = async (id) => {
    const localPC = new RTCPeerConnection(configuration);
    localStream.getTracks().forEach((track) => {
      localPC.addTrack(track, localStream);
    });

    const roomRef = doc(db, "rooms", id);
    const callerCandidatesCollection = collection(roomRef, "callerCandidates");
    const calleeCandidatesCollection = collection(roomRef, "calleeCandidates");

    localPC.addEventListener("icecandidate", (e) => {
      if (!e.candidate) {
        console.log("Got final candidate!");
        return;
      }
      addDoc(callerCandidatesCollection, e.candidate.toJSON());
      console.log("add icedoc");
    });

    localPC.ontrack = (e) => {
      const newStream = new MediaStream();
      e.streams[0].getTracks().forEach((track) => {
        newStream.addTrack(track);
      });
      setRemoteStream(newStream);
    };

    // localPC.onaddstream = (e) => {
    //   if (e.stream && remoteStream !== e.stream) {
    //     console.log("RemotePC received the stream join", e.stream);
    //     setRemoteStream(e.stream);
    //   }
    // };

    const offer = await localPC.createOffer();
    await localPC.setLocalDescription(offer);

    await setDoc(roomRef, { offer, connected: false }, { merge: true });

    // Listen for remote answer
    const unsub1 = onSnapshot(roomRef, (doc) => {
      const data = doc.data();
      //   console.log("room update");
      try {
        if (!localPC.currentRemoteDescription && data.answer) {
          //   console.log("update remote des");
          const rtcSessionDescription = new RTCSessionDescription(data.answer);
          localPC.setRemoteDescription(rtcSessionDescription);
        } else {
          setRemoteStream();
        }
      } catch (error) {
        Alert.alert("Ee", error.message);
      }
    });

    // when answered, add candidate to peer connection
    const unsub2 = onSnapshot(calleeCandidatesCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          let data = change.doc.data();
          console.log("added ");
          localPC.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });

    setCachedLocalPC(localPC);
    console.log([unsub1, unsub2]);
    setUnsubs([unsub1, unsub2]);
  };

  const switchCamera = () => {
    localStream.getVideoTracks().forEach((track) => track._switchCamera());
  };

  // Mutes the local's outgoing audio
  const toggleMute = () => {
    if (!remoteStream) {
      return;
    }
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  const toggleCamera = () => {
    localStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsOffCam(!isOffCam);
    });
  };

  return (
    <View className="flex-1 bg-red-600">
      {/* <Text>{JSON.stringify(unsubs)}</Text> */}
      {!remoteStream && (
        <RTCView
          className="flex-1"
          streamURL={localStream && localStream.toURL()}
          objectFit={"cover"}
        />
      )}

      {remoteStream && (
        <>
          <RTCView
            className="flex-1"
            zOrder={0}
            streamURL={remoteStream && remoteStream.toURL()}
            objectFit={"cover"}
          />
          {!isOffCam && (
            <RTCView
              className="w-32 h-48 absolute right-6 top-8"
              streamURL={localStream && localStream.toURL()}
            />
          )}
        </>
      )}
      <View className="absolute bottom-0 w-full">
        <CallActionBox
          switchCamera={switchCamera}
          toggleMute={toggleMute}
          toggleCamera={toggleCamera}
          endCall={endCall}
        />
      </View>
    </View>
  );
}
