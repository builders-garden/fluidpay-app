import { useAddress } from "@thirdweb-dev/react-native";
import { useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Appbar, ActivityIndicator } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseAuth, firebaseFirestore } from "../firebaseConfig";
import AppButton from "../components/app-button";
import { router } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useUserStore } from "../store";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMe, updateMe } from "../lib/api";
import { DBUser } from "../store/interfaces";

const generatePassword = () => {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const passwordLength = 12;
  let password = "";
  for (let i = 0; i <= passwordLength; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  return password;
};

export default function Onboarding() {
  const [step] = useState(0);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const address = useAddress();
  const setUser = useUserStore((state) => state.setUser);

  const finishOnboarding = async () => {
    // await setFirebaseUsername();
    // await SecureStore.setItemAsync(`onboarding-${address}`, "true");
    console.log("set user 2");
    const data = {
      displayName: name,
      username,
    };
    const token = await SecureStore.getItemAsync(`token-${address}`);
    if (token) {
      const res = await updateMe(token, data);
      console.log(res);
      setUser({ ...res, token } as DBUser);
      router.push("/app/home");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black px-4">
      <Text className="text-3xl text-white font-bold">Setup your profile</Text>
      {/* {step === 0 && (
        <View className="flex-1 flex-col items-center justify-center space-y-2 mx-4">
          <Text className="text-white font-semibold text-lg text-center">
            Creating your account, this might{"\n"} take a while.
          </Text>
          <Text className="text-[#8F8F91] text-center font-medium">
            {creationStatus}
          </Text>
          <ActivityIndicator animating={loading} color={"#667DFF"} />
        </View>
      )} */}
      {step === 0 && (
        <View className="flex flex-col flex-grow justify-between mb-12">
          <View className="flex flex-col space-y-4">
            <View className="w-full mt-4">
              <Text className="text-white text-xl font-semibold my-2">
                What's your name?
              </Text>
              <Text className="text-[#8F8F91] mb-2">
                This is just for displaying purposes.
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                placeholder="First and last name"
                className="mb-2 text-white bg-[#232324] px-3 py-4 rounded-lg placeholder-[#8F8F91]"
              />
            </View>
            <View className="w-full mt-4">
              <Text className="text-white text-xl font-semibold my-2">
                Pick a username
              </Text>
              <Text className="text-[#8F8F91] mb-2">
                This is how your frens will be able to find you in the app and
                it’s unique.
              </Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                placeholder="First and last name"
                className="mb-2 text-white bg-[#232324] px-3 py-4 rounded-lg placeholder-[#8F8F91]"
              />
            </View>
          </View>
          <AppButton
            text="Done!"
            variant={
              username.length > 3 && name.length > 3 ? "primary" : "disabled"
            }
            onPress={() => finishOnboarding()}
          />
        </View>
      )}
      {step === 2 && (
        <View className="flex-1 flex-col items-center justify-center space-y-2">
          <Text className="text-white font-semibold text-xl">
            Your account has been created!
          </Text>
          <View className="w-full max-w-[300px]">
            <AppButton text="Enable notifications" onPress={() => {}} />
          </View>
          <View className="w-full max-w-[300px]">
            <AppButton
              text="Continue"
              variant="ghost"
              onPress={() => finishOnboarding()}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
