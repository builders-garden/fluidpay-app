import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "split3-7bb3c.firebaseapp.com",
  databaseURL: "https://split3-7bb3c.firebaseio.com",
  projectId: "split3-7bb3c",
  storageBucket: "split3-7bb3c.appspot.com",
  messagingSenderId: "sender-id",
  appId: "1:375466015675:ios:2a4493441fbe800fce229e",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const firebaseFirestore = getFirestore(app);
