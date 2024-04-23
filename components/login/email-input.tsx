import { View, TextInput, Text } from "react-native";
import AppButton from "../app-button";
import { useState } from "react";
import { useLoginWithEmail } from "@privy-io/expo";
import { LoginStatus } from "../../app/index";
import analytics from "@react-native-firebase/analytics";

export default function EmailInput({
  email,
  setEmail,
  setCode,
  setIsLoading,
  setLoadingMessage,
  setLoginStatus,
}: {
  email: string;
  setEmail: (email: string) => void;
  setCode: (code: `${number | ""}`) => void;
  setIsLoading: (isLoading: boolean) => void;
  setLoadingMessage: (message: string) => void;
  setLoginStatus: (status: LoginStatus) => void;
}) {
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const { sendCode } = useLoginWithEmail({
    onSendCodeSuccess(args) {
      console.log("Code sent", args);
    },
    onError: (error) => {
      console.error(error);
      setLoginStatus(LoginStatus.EMAIL_ERROR);
    },
    onLoginSuccess(user) {
      console.log("Logged in", user);
    },
  });
  const validateEmail = (email: string) => {
    const re = /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
  };
  return (
    <View className="w-full">
      <View className="w-full flex flex-col space-y-1 mb-4">
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          inputMode="email"
          clearButtonMode="while-editing"
          placeholder="youremail@example.com"
          placeholderTextColor={"#8F8F91"}
          className=" text-white bg-[#232324] px-3 py-4 rounded-lg"
        />
        {!isEmailValid && (
          <Text className="text-red-500 text-sm">
            Please enter a valid email
          </Text>
        )}
      </View>
      <AppButton
        // Keeps button disabled while code is being sent
        disabled={email?.length === 0}
        onPress={async () => {
          if (!validateEmail(email!)) {
            setIsEmailValid(false);
            return;
          }
          setIsLoading(true);
          setLoadingMessage("Sending code...");
          await sendCode({ email: email! });
          setLoadingMessage("");
          setIsLoading(false);
          setCode("");
          await analytics().logLogin({ method: "email" });
          setLoginStatus(LoginStatus.SUCCESS_EMAIL);
        }}
        variant={email?.length === 0 ? "disabled" : "primary"}
        text="Login with Email"
      />
    </View>
  );
}
