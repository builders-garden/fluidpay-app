import { router } from "expo-router";
import { View, TextInput, Text } from "react-native";
import AppButton from "../app-button";
import { useEffect, useRef } from "react";
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
  code: string[];
  setCode: (code: string[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setLoadingMessage: (message: string) => void;
  setLoginStatus: (status: LoginStatus) => void;
  email: string;
}) {
  const { sendCode, loginWithCode } = useLoginWithEmail({
    onError: (error) => {
      console.error("ERRRORRRR", error);
      setLoginStatus(LoginStatus.CODE_ERROR);
    },
    onLoginSuccess(user) {
      console.log("Logged in", user);
    },
  });
  const inputRefs = useRef<TextInput[]>([]);
  const handleInputChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
  };
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && index >= 0) {
      inputRefs.current[index - 1]?.focus();
      handleInputChange("", index);
    } else if (
      parseInt(e.nativeEvent.key) >= 0 &&
      parseInt(e.nativeEvent.key) <= 9
    ) {
      inputRefs.current[index + 1]?.focus();
      handleInputChange(e.nativeEvent.key, index);
    }
  };
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, code.length);
  }, [code]);
  console.log("Code", code.join(""));
  return (
    <View className="w-full flex flex-col">
      <Text className="text-white text-xl text-center mb-4">
        We sent a code to {email}
      </Text>
      <View className="flex flex-row mb-4 space-x-4 justify-around">
        {code.map((value, index) => (
          <TextInput
            key={index}
            value={value}
            // onChangeText={(text) => handleInputChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            maxLength={1}
            keyboardType="numeric"
            ref={(el: TextInput) => (inputRefs.current[index] = el)}
            className="text-4xl text-center basis-1/6 text-white bg-[#232324] py-4 rounded-lg placeholder-white"
          />
        ))}
      </View>

      <AppButton
        // Keeps button disabled until the code has been sent
        disabled={code.join("").length !== 6}
        onPress={async () => {
          console.log("Logging in with code", code.join(""));
          setIsLoading(true);
          setLoadingMessage("Verifying code...");
          await loginWithCode({
            code: code.join(""),
            email,
          });
          setIsLoading(false);
          setLoadingMessage("");
          setLoginStatus(LoginStatus.SUCCESS_CODE);
        }}
        text="Enter code"
        variant={code?.join("").length === 6 ? "primary" : "disabled"}
      />
      <Text
        className="mt-8 text-blue-500 text-center font-bold"
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
