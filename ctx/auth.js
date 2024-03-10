import { useState, createContext, useContext, useEffect } from "react";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Alert } from "react-native";
import { useNoti } from "./useNoti";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// console.log('firebase init')
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { expoPushToken } = useNoti();
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("authchanged  ", user?.uid);
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        updateUserData(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return unsub;
    // setTimeout(() => {
    // 	setIsAuthenticated(false)
    // }, 2000);
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "856639902240-m9cle0sldqecqmq2dlvukb6uhcd16l1a.apps.googleusercontent.com",
    });
  }, []);

  const updateDevices = async (user, remove = false) => {
    // console.log(expoPushToken)
    // console.log("updatedevices");

    if (!expoPushToken) return;
    const docRef = doc(db, "users", user.uid);
    try {
      if (remove) {
        await updateDoc(docRef, {
          devices: arrayRemove(expoPushToken),
        });
      } else {
        await updateDoc(docRef, {
          devices: arrayUnion(expoPushToken),
        });
        // console.log('updated')
      }
    } catch (e) {
      Alert.alert("Devices", e.message);
      // Alert.alert("Failed to update devices");
    }
  };

  const updateUserData = async (user) => {
    const docRef = doc(db, "users", user.uid);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let data = docSnap.data();
        // console.log("updated ", user);
        setUser({
          ...user,
          username: data.username,
          profileUrl: data.profileUrl,
          userId: data.userId,
        });
      }
    } catch (e) {
      // Alert.alert(e.message)
      Alert.alert("Failed to get user info");
    }
  };

  const login = async (email, password) => {
    try {
      // console.log(email, password)
      const response = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      updateDevices(response.user);

      return {
        success: true,
        data: response?.user,
      };
    } catch (e) {
      let msg = e.message;
      // if (msg.includes("auth/invalid-email")) msg = "Invalid Email";
      if (msg.includes("auth/invalid-credential")) msg = "Invalid Credentials";
      return {
        success: false,
        message: msg,
      };
    }
  };
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const response = await signInWithCredential(auth, googleCredential);
      // console.log(response);

      let userId = response?.user?.uid;
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        // register
        await setDoc(userRef, {
          username: response?.user?.displayName,
          profileUrl: response?.user?.photoURL,
          userId: response?.user?.uid,
          devices: [expoPushToken],
        });
        // console.log("first time not exists");
      } else {
        // login
        updateDevices(response.user);
      }

      return {
        success: true,
        data: response?.user,
      };
    } catch (e) {
      let msg = e.message;
      // if (msg.includes("auth/invalid-email")) msg = "Invalid Email";
      return {
        success: false,
        message: msg,
      };
    }
  };
  const logout = async () => {
    // console.log("logout");
    try {
      updateDevices(user, true);
      // console.log(GoogleSignin.signOut());
      await GoogleSignin.signOut();
      // if (GoogleSignin.isSignedIn()) {
      // await GoogleSignin.revokeAccess();
      // }
      await signOut(auth);
    } catch (e) {
      Alert.alert("Logout", e.message);
    }
  };
  const register = async (email, password, username, profileUrl) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // console.log(response?.user);

      await setDoc(doc(db, "users", response?.user?.uid), {
        username,
        profileUrl,
        userId: response?.user?.uid,
        devices: [],
      });
      return {
        success: true,
        data: response?.user,
      };
    } catch (e) {
      let msg = e.message;
      if (msg.includes("auth/invalid-email")) msg = "Invalid Email";
      if (msg.includes("auth/email-already-in-use"))
        msg = "Email already in use";
      return {
        success: false,
        message: msg,
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
};
