import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import AppButton from "../components/app-button";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { usePrivyWagmiProvider } from "@buildersgarden/privy-wagmi-provider";
import PinInput from "../components/login/pin-input";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Pin() {
  const [isLoading, setIsLoading] = useState(true);
  const { address } = usePrivyWagmiProvider();
  const [pin, setPin] = useState(Array(4).fill(""));
  const [storedPin, setStoredPin] = useState<string | null>(null);
  const [hasPin, setHasPin] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(`pin-${address}`).then((pin) => {
      if (pin) {
        setHasPin(true);
        setStoredPin(pin);
      }
      setIsLoading(false);
    });
  });

  const storePin = async () => {
    const pinString = pin.join("");
    await SecureStore.setItemAsync(`pin-${address}`, pinString);
    router.push("/app/home");
  };

  const checkPin = async () => {
    const pinString = pin.join("");
    if (pinString === storedPin) {
      router.push("/app/home");
    } else {
      setError(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black px-4">
      {isLoading && (
        <View className="justify-center items-center">
          <ActivityIndicator color="white" />
        </View>
      )}
      {!isLoading && (
        <KeyboardAvoidingView
          className="w-full px-4 flex flex-1 flex-col text-left justify-between mb-12"
          behavior="padding"
        >
          <View className="flex flex-col space-y-8">
            <View className="flex flex-col space-y-2">
              <Text className="text-3xl text-white font-bold text-left">
                {hasPin ? "Enter your PIN" : "Set your PIN"}
              </Text>
              <Text className="text-white text-left">
                {hasPin
                  ? "Please enter your 4-digit PIN to continue"
                  : "Please set a 4-digit PIN to secure your account"}
              </Text>
              {error && (
                <View className="bg-red-500/10  rounded-lg flex flex-row space-x-2 p-4 items-center">
                  <Icon name={"error"} color="red" size={24} />
                  <Text className="text-red-500 text-left">
                    Incorrect PIN, please try again!
                  </Text>
                </View>
              )}
            </View>

            <View className="flex flex-col space-y-2 text-left">
              <PinInput pin={pin} setPin={setPin} />
            </View>
          </View>
          <AppButton
            text={hasPin ? "Enter" : "Set"}
            onPress={hasPin ? checkPin : storePin}
            disabled={pin.join("").length < 4}
          />
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
