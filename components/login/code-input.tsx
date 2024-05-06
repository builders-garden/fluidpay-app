import { router } from "expo-router";
import { View, Text } from "react-native";
import AppButton from "../app-button";
import { LoginStatus } from "../../app/index";
import CodeTextInput from "../code-text-input";

type SendCode = (args: { email: string }) => Promise<any>;
type LoginWithCode = (args: {
  code: string;
  email?: string | undefined;
}) => Promise<any | undefined>;

type CodeInputProps = {
  code: `${number | ""}`;
  setCode: (code: `${number | ""}`) => void;
  setIsLoading: (isLoading: boolean) => void;
  setLoadingMessage: (message: string) => void;
  setLoginStatus: (status: LoginStatus) => void;
  email: string;
  sendCode: SendCode;
  loginWithCode: LoginWithCode;
};

export default function CodeInput({
  code,
  setCode,
  setIsLoading,
  setLoadingMessage,
  setLoginStatus,
  email,
  sendCode,
  loginWithCode,
}: CodeInputProps) {
  const MAX_CODE_LENGTH = 6;
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
        disabled={code.length !== 6} // Keeps button disabled until the code has been sent
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
