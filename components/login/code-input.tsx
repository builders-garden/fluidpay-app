import { router } from "expo-router";
import { View, TextInput, Text, Pressable } from "react-native";
import AppButton from "../app-button";
import { useRef, useState } from "react";
import { useLoginWithEmail, usePrivy } from "@privy-io/expo";
import { LoginStatus } from "../../app/index";
import { parse } from "react-native-svg";

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
  const [inputFocused, setInputFocused] = useState(false);
  const { sendCode, loginWithCode } = useLoginWithEmail({
    onError: (error) => {
      console.error("ERRRORRRR", error);
      setLoginStatus(LoginStatus.CODE_ERROR);
    },
    onLoginSuccess(user) {
      console.log("Logged in", user);
    },
  });
  const textInputRef = useRef<TextInput>(null);

  const handleTextChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setCode(numericValue as `${number | ""}`);
  };

  const handleTextFocus = () => {
    setInputFocused(true);
    textInputRef.current?.focus();
  };

  return (
    <View className="w-full flex flex-col">
      <Text className="text-white text-xl text-center mb-4">
        We sent a code to {email}
      </Text>

      <Pressable
        onPress={handleTextFocus}
        className="flex flex-row mb-4 space-x-4 justify-around"
      >
        {Array(MAX_CODE_LENGTH)
          .fill(null)
          .map((_, index) => {
            const isCurrentDigit = index === code.length;
            const isLastDigit = index === code.length - 1;
            const isCodeFull = code.length === MAX_CODE_LENGTH;

            const isDigitFocused =
              isCurrentDigit || (isCodeFull && isLastDigit);
            const focused = inputFocused && isDigitFocused;
            return (
              <View
                key={index}
                className={
                  "basis-1/6 text-white bg-[#232324] py-4 rounded-lg" +
                  (focused ? " border-2 border-primary" : "")
                }
              >
                <Text className="text-4xl text-center placeholder-white">
                  {code[index] || " "}
                </Text>
              </View>
            );
          })}
      </Pressable>

      <TextInput
        value={code}
        onChangeText={handleTextChange}
        onBlur={() => setInputFocused(false)}
        maxLength={MAX_CODE_LENGTH}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        ref={textInputRef}
        className="w-px h-px absolute opacity-0"
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
