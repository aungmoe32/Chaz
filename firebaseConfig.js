// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from "firebase/auth/react-native"
import { getFirestore, collection } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
  
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2nu9b5D-7Y8Pc07uVGYsJ5Xjit2irAVo",
  authDomain: "react-auth-6a768.firebaseapp.com",
  projectId: "react-auth-6a768",
  storageBucket: "react-auth-6a768.appspot.com",
  messagingSenderId: "856639902240",
  appId: "1:856639902240:web:b243064abf7faed652a245"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);

export const usersRef = collection(db, 'users')
export const roomsRef = collection(db, 'rooms')