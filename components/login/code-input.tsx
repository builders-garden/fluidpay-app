import { router } from "expo-router";
import { View, TextInput, Text, Pressable } from "react-native";
import AppButton from "../app-button";
import { useRef, useState } from "react";
import { useLoginWithEmail, usePrivy } from "@privy-io/expo";
import { LoginStatus } from "../../app/index";
import { parse } from "react-native-svg";
import CodeTextInput from "../code-text-input";

export default function CodeInput({
  code,
  setCode,
  setIsLoading,
  setLoadingMessage,
  setLoginStatus,
  email,
}: {
  code: `${number | ""}`;
  setCode: (code: `${number | ""}`) => void;
  setIsLoading: (isLoading: boolean) => void;
  setLoadingMessage: (message: string) => void;
  setLoginStatus: (status: LoginStatus) => void;
  email: string;
}) {
  const MAX_CODE_LENGTH = 6;
  const { sendCode, loginWithCode } = useLoginWithEmail({
    onError: (error) => {
      console.error("ERRRORRRR", error);
      setLoginStatus(LoginStatus.CODE_ERROR);
    },
    onLoginSuccess(user) {
      console.log("Logged in", user);
    },
  });

  return (
    <View className="w-full flex flex-col">
      <Text className="text-white text-xl text-center mb-4">
        We sent a code to {email}
      </Text>

      <CodeTextInput
        code={code}
        setCode={setCode}
        maxCodeLength={MAX_CODE_LENGTH}
      />

      <AppButton
        // Keeps button disabled until the code has been sent
        disabled={code.length !== 6}
        onPress={async () => {
          console.log("Logging in with code", code);
          setIsLoading(true);
          setLoadingMessage("Verifying code...");
          await loginWithCode({
            code: code,
            email,
          });
          setIsLoading(false);
          setLoadingMessage("");
          setLoginStatus(LoginStatus.SUCCESS_CODE);
        }}
        text="Enter code"
        variant={code?.length === 6 ? "primary" : "disabled"}
        mt="mt-4"
      />
      <Text
        className="mt-8 text-primary text-center font-bold"
        onPress={() => sendCode({ email: email! })}
      >
        Didn&apos;t receive anything? Send again
      </Text>
      <Text
        className="mt-4 text-gray-500 text-center font-semibold"
        onPress={() => {
          router.replace("/");
        }}
      >
        Change email
      </Text>
    </View>
  );
}
