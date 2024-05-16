import { Pressable, SafeAreaView, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import CodeTextInput from "../code-text-input";
import AppButton from "../app-button";
import { DBUser } from "../../store/interfaces";
import { ScanFace } from "lucide-react-native";
import { useState } from "react";
import { useDisconnect } from "wagmi";
import { router } from "expo-router";

const Biometrics = (props: {
  user: DBUser;
  address: string;
  logout: () => Promise<void>;
  setUser: (user?: DBUser | undefined) => void;
}) => {
  const { address, user, logout, setUser } = props;
  const { disconnect } = useDisconnect();
  const useBiometrics = !!SecureStore.getItem(`user-faceid-${address}`);
  const passcode = SecureStore.getItem("user-passcode");

  const [code, setCode] = useState<`${number}` | "">("");
  const [codeError, setCodeError] = useState({
    message: "",
    count: 0,
  });

  const authenticatePin = () => {
    if (code === passcode) {
      router.push("/app/home");
    } else {
      setCodeError({
        message: "Incorrect passcode. Please try again",
        count: codeError.count + 1,
      });
    }
  };

  const authenticateBiometrics = async () => {
    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login to Plink",
    });
    if (auth.success) {
      router.push("/app/home");
    }
  };

  const universalLogout = async () => {
    try {
      await SecureStore.deleteItemAsync(`token-${address}`);
      await logout();
      disconnect();

      setUser(undefined);

      router.replace("/");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-absoluteWhite dark:bg-black mb-5">
      <View className="px-4 flex-1">
        <Text className="text-4xl text-darkGrey dark:text-white font-semibold mb-1">
          Welcome back 👋
        </Text>

        <Text className="text-xl text-mutedGrey font-normal mb-5">
          @{user.username}
        </Text>

        <View className="flex-row justify-center py-6">
          {useBiometrics && (
            <Pressable
              onPress={authenticateBiometrics}
              className="rounded-xl h-12 w-12 flex items-center justify-center bg-primary"
            >
              <ScanFace size={24} color="#FFF" />
            </Pressable>
          )}
        </View>

        <Text className="text-mutedGrey text-sm text-center font-semibold mb-2">
          Enter your passcode
        </Text>
        <CodeTextInput
          code={code}
          error={!!codeError.count}
          errorCount={codeError.count}
          setCode={setCode}
          maxCodeLength={4}
          codeBoxHeight={99}
          hidden
        />

        {!!codeError.count && (
          <Text className="text-center text-red-500 text-base mt-5">
            {codeError.message}
          </Text>
        )}

        <View className="flex-row justify-center items-center gap-2 mt-5">
          <Text className="text-darkGrey dark:text-white">Not you?</Text>
          <Pressable onPress={universalLogout}>
            <Text className="text-primary font-semibold">Log out</Text>
          </Pressable>
        </View>

        <SafeAreaView className="mt-auto">
          <AppButton
            text="Confirm"
            variant={code.length < 4 ? "disabled" : "primary"}
            onPress={authenticatePin}
          />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
};

export default Biometrics;
