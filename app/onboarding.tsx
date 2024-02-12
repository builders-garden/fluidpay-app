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
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [creationStatus, setCreationStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const address = useAddress();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (address) {
      step === 0 && createAccount(address);
    }
  }, [step, address]);

  const createAccount = async (address: string) => {
    setCreationStatus("Creating user...");
    let password = await SecureStore.getItemAsync(`password-${address}`);
    if (!password) {
      password = generatePassword();
    }
    await SecureStore.setItemAsync(`password-${address}`, password);

    if (!firebaseAuth.currentUser) {
      try {
        await createUserWithEmailAndPassword(
          firebaseAuth,
          `${address}@crumina.app`,
          password
        );
      } catch (error) {
        await signInWithEmailAndPassword(
          firebaseAuth,
          `${address}@crumina.app`,
          password
        );
      }
    } else {
      await signInWithEmailAndPassword(
        firebaseAuth,
        `${address}@crumina.app`,
        password
      );
    }

    setTimeout(() => {
      setLoading(false);
      setStep(step + 1);
    }, 1500);
  };

  const setFirebaseUsername = async () => {
    console.log(address);
    if (!address || loading) {
      console.log(address, loading);
      return;
    }
    setLoading(true);
    try {
      const user = {
        address: address,
        username,
        rounding: isEnabled,
        createdAt: new Date().toISOString(),
      };
      console.log(user);
      await setDoc(
        doc(firebaseFirestore, "users", firebaseAuth.currentUser!.uid),
        user
      );
      console.log("set user");
      setUser(user);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("FINALLY");
      setLoading(false);
    }
  };

  const finishOnboarding = async () => {
    await setFirebaseUsername();
    await SecureStore.setItemAsync(`onboarding-${address}`, "true");
    console.log("set user 2");

    router.push("/app/home");
  };

  return (
    <View className="flex-1 ">
      <Appbar.Header className="bg-black text-white">
        <Appbar.Content
          title="Onboarding"
          color="#fff"
          titleStyle={{ fontWeight: "bold" }}
        />
      </Appbar.Header>
      {step === 0 && (
        <View className="flex-1 flex-col items-center justify-center space-y-2 mx-4">
          <Text className="text-white font-semibold text-lg text-center">
            Creating your account, this might{"\n"} take a while.
          </Text>
          <Text className="text-[#8F8F91] text-center font-medium">
            {creationStatus}
          </Text>
          <ActivityIndicator animating={loading} color={"#667DFF"} />
        </View>
      )}
      {step === 1 && (
        <View className="flex flex-col flex-grow px-4 justify-between mb-12">
          <View className="w-full">
            <View>
              <Text className="text-white font-semibold my-2">Username</Text>
              <Text className="text-white mb-2">
                Other users will be able to find you via this name.
              </Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                className="mb-2 text-white border-2 border-white px-2 py-3 rounded-md placeholder-white"
              />
            </View>
          </View>
          <AppButton
            text="Complete onboarding"
            variant={username.length > 3 ? "primary" : "disabled"}
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
    </View>
  );
}
