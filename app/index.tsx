import { Image, Pressable, SafeAreaView, Text, View } from "react-native";
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
import { getMe, UsersMeResponse } from "../lib/api";
import { ScanFace } from "lucide-react-native";

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

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loginStatus, setLoginStatus] = useState<LoginStatus>(
    LoginStatus.INITIAL
  );

  const token = SecureStore.getItem(`token-${address}`);
  const useBiometrics = !!SecureStore.getItem(`user-faceid-${address}`);
  const passcode = SecureStore.getItem("user-passcode");

  useEffect(() => {
    if (address && isReady) {
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
  }, [address, isReady]);

  const authorise = async (userData: UsersMeResponse | DBUser) => {
    try {
      if (useBiometrics) {
        const auth = await LocalAuthentication.authenticateAsync({
          promptMessage: "Login to Plink",
        });

        if (!auth.success) {
          throw new Error(auth.error);
        }
      } else if (passcode) {
      }

      if (!userData?.username) {
        router.push("/onboarding");
      } else if (userData?.username && !passcode) {
        router.push("/set-pin");
      } else {
        router.push("/app/home");
      }
    } catch (error) {
      console.log("Authentication failed", error);
      throw new Error(error as any);
    }
  };

  const fetchUserData = async (token: string) => {
    try {
      const userData = await getMe(token);
      setUser({ ...userData, token } as DBUser);

      return userData;
    } catch (error) {
      console.log("Error fetching user data", { error });
      setIsLoading(false);

      throw new Error(error as any);
    }
  };

  const getToken = async () => {
    try {
      if (token) {
        const userData = await fetchUserData(token);

        await authorise(userData!);
        return token;
      }
    } catch (error) {
      console.error(error as any);
      throw new Error(error as any);
    }
  };

  if (!isReady) {
    return (
      <SafeAreaView className="flex flex-1 justify-center items-center">
        <ActivityIndicator animating={true} color={"#FF238C"} />
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
        <View className="px-16 space-y-5 items-center">
          <Text
            className={`text-white text-xl text-center leading-tight font-semibold`}
          >
            Your USDC shortcut.
          </Text>

          {!!token && useBiometrics && (
            <Pressable
              onPress={() => authorise(storedUser!)}
              className="rounded-full h-12 w-12 flex items-center justify-center bg-primary"
            >
              <ScanFace size={24} color="#FFF" />
            </Pressable>
          )}
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
