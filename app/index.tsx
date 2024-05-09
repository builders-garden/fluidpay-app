import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useUserStore } from "../store";
import { getUserEmbeddedWallet, usePrivy } from "@privy-io/expo";
import * as LocalAuthentication from "expo-local-authentication";

import { useEffect, useState } from "react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { DBUser } from "../store/interfaces";
import { usePrivyWagmiProvider } from "@buildersgarden/privy-wagmi-provider";
import LoginForm from "../components/login/login-form";
import { getMe } from "../lib/api";
import { ScanFace } from "lucide-react-native";
import AppButton from "../components/app-button";
import CodeTextInput from "../components/code-text-input";
import { useDisconnect } from "wagmi";

export enum LoginStatus {
  INITIAL = "initial",
  EMAIL_ERROR = "email-error",
  CODE_ERROR = "code-error",
  SUCCESS_EMAIL = "email-success",
  SUCCESS_CODE = "code-success",
}

const Home = () => {
  const { isReady, user, logout } = usePrivy();
  // const { address } = usePrivyWagmiProvider();
  const address = getUserEmbeddedWallet(user)?.address;

  const { user: storedUser, setUser } = useUserStore((state) => state);
  const { disconnect } = useDisconnect();

  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [userFetchingCounter, setUserFetchingCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [code, setCode] = useState<`${number}` | "">("");
  const [codeError, setCodeError] = useState("");
  const [loginStatus, setLoginStatus] = useState<LoginStatus>(
    LoginStatus.INITIAL
  );

  const token = SecureStore.getItem(`token-${address}`);
  const useBiometrics = !!SecureStore.getItem(`user-faceid-${address}`);
  const passcode = SecureStore.getItem("user-passcode");

  useEffect(() => {
    if (address) {
      setIsLoading(true);
      setLoadingMessage("Logging in...");
      getToken()
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => {
          SecureStore.deleteItemAsync(`token-${address}`).then(() => logout());
          setIsLoading(false);
        });
    }
  }, [address]);

  const authenticatePin = () => {
    if (code === passcode) {
      router.push("/app/home");
    } else {
      setCodeError("Incorrect passcode. Please try again");
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

  const fetchUserData = async (token: string) => {
    try {
      setIsFetchingUser(true);
      setUserFetchingCounter(userFetchingCounter + 1);
      const userData = await getMe(token);
      setUser({ ...userData, token } as DBUser);
      setIsFetchingUser(false);

      return userData;
    } catch (error) {
      console.log("Error fetching user data", { error });
      setIsLoading(false);
      setIsFetchingUser(false);

      throw new Error(error as any);
    }
  };

  const getToken = async () => {
    try {
      if (token) {
        const userData = await fetchUserData(token);

        if (!userData?.username) {
          router.push("/onboarding");
        } else if (userData?.username && !passcode) {
          router.push("/set-pin");
        }

        return token;
      }
    } catch (error) {
      console.error(error as any);
      throw new Error(error as any);
    }
  };

  if (!isReady || (isFetchingUser && userFetchingCounter < 2)) {
    return (
      <SafeAreaView className="flex flex-1 justify-center items-center">
        <ActivityIndicator animating={true} color={"#FF238C"} />
      </SafeAreaView>
    );
  }

  if (!!token && storedUser && !!passcode) {
    return (
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView className="w-full flex-1" behavior="padding">
          <Pressable onPress={Keyboard.dismiss} className="px-4 flex-1 mb-12">
            <Text className="text-4xl text-white font-semibold mb-1">
              Welcome back 👋
            </Text>

            <Text className="text-xl text-mutedGrey font-normal mb-5">
              @{storedUser.username}
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
              error={!!codeError}
              setCode={setCode}
              maxCodeLength={4}
              codeBoxHeight={99}
              hidden
            />

            {!!codeError && (
              <Text className="text-center text-red-500 text-base mt-5">
                {codeError}
              </Text>
            )}

            <View className="flex-row justify-center items-center gap-2 mt-5">
              <Text className="text-white">Not you?</Text>
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
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex flex-1 justify-between items-center space-y-3 mx-4">
      <View className="text-center flex flex-col space-y-4 justify-center items-center">
        <Image
          className="mt-24 h-14 w-56"
          source={require("../images/plink.png")}
        />
        <View className="px-16">
          <Text
            className={`text-white text-xl text-center leading-tight font-semibold`}
          >
            Your USDC shortcut.
          </Text>
        </View>
      </View>

      {isLoading && (
        <View className="flex flex-col space-y-8">
          <ActivityIndicator animating={true} color={"#FF238C"} />
          <Text className="text-primary font-medium text-lg text-center ">
            {loadingMessage}
          </Text>
        </View>
      )}
      {/* 
      {isReady && user && !skipBiometrics && (
        <View className="w-full">
          <AppButton
            onPress={() => authorise(storedUser as UsersMeResponse)}
            text="Unlock"
          />
        </View>
      )} */}

      {isReady && (
        <LoginForm
          setIsLoading={setIsLoading}
          setLoadingMessage={setLoadingMessage}
          loginStatus={loginStatus}
          setLoginStatus={setLoginStatus}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
