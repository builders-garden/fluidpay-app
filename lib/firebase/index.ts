import firebase from '@react-native-firebase/app';

// Your Firebase config
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: "fluidpay-b5ae9.firebaseapp.com",
    databaseURL: "https://fluidpay-b5ae9-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fluidpay-b5ae9",
    messagingSenderId: "347017464990",
    storageBucket: "fluidpay-b5ae9.appspot.com",
    appId: "1:347017464990:ios:dad6f6e8b4a3b583ec7f8f",
  };

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
