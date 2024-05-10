import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  Text,
} from "react-native";
import { router } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

import CodeTextInput from "../components/code-text-input";
import AppButton from "../components/app-button";

const SetPin = () => {
  const [code, setCode] = useState<`${number}` | "">("");
  const MAX_CODE_LENGTH = 4;

  const setPin = async () => {
    await SecureStore.setItemAsync("user-passcode", code);
    // Check if hardware supports biometrics
    const compatible = await LocalAuthentication.hasHardwareAsync();

    if (compatible) {
      router.push("/set-faceid");
    } else {
      router.push("/app/home");
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView className="w-full flex-1" behavior="padding">
        <Pressable onPress={Keyboard.dismiss} className="px-4 flex-1">
          <Text className="text-4xl text-white font-semibold mb-7">
            Set a passcode
          </Text>

          <Text className="text-xl text-white font-semibold mb-5">
            Choose a 4-digit code only you know
          </Text>
          <Text className="text-base text-mutedGrey mb-5">
            This passcode will safeguard your transactions and account
            information
          </Text>

          <CodeTextInput
            code={code}
            setCode={setCode}
            maxCodeLength={MAX_CODE_LENGTH}
            codeBoxHeight={99}
          />

          <Text className="text-center text-mutedGrey text-base mt-5">
            You can change this later
          </Text>

          <SafeAreaView className="mt-auto">
            <AppButton
              text="Confirm"
              variant={code.length < MAX_CODE_LENGTH ? "disabled" : "primary"}
              onPress={setPin}
            />
          </SafeAreaView>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SetPin;
