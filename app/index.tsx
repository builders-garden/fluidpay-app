import { Image, SafeAreaView, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useGroupsStore, useTransactionsStore, useUserStore } from "../store";
import { usePrivy } from "@privy-io/expo";
import * as LocalAuthentication from "expo-local-authentication";

import { useEffect, useState } from "react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { DBUser } from "../store/interfaces";
import { usePrivyWagmiProvider } from "@buildersgarden/privy-wagmi-provider";
import LoginForm from "../components/login/login-form";
import { getMe, UsersMeResponse } from "../lib/api";
import { useChainStore } from "../store/use-chain-store";
import AppButton from "../components/app-button";

export enum LoginStatus {
  INITIAL = "initial",
  EMAIL_ERROR = "email-error",
  CODE_ERROR = "code-error",
  SUCCESS_EMAIL = "email-success",
  SUCCESS_CODE = "code-success",
}

const Home = () => {
  const { isReady, user, getAccessToken, logout } = usePrivy();
  const { address } = usePrivyWagmiProvider();

  const { user: storedUser, setUser } = useUserStore((state) => state);
  const setTransactions = useTransactionsStore(
    (state) => state.setTransactions
  );
  const setGroups = useGroupsStore((state) => state.setGroups);
  const setChain = useChainStore((state) => state.setChain);
  const chain = useChainStore((state) => state.chain);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loginStatus, setLoginStatus] = useState<LoginStatus>(
    LoginStatus.INITIAL
  );
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isProfileReady, setIsProfileReady] = useState(false);
  const [skipBiometrics, setSkipBiometrics] = useState(false);

  // Check if hardware supports biometrics
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  useEffect(() => {
    if (address && user) {
      setIsLoading(true);
      setLoadingMessage("Logging in...");
      getToken(address).then(() => {
        setIsLoading(false);
      });
    }
  }, [address, user]);

  useEffect(() => {
    getAccessToken()
      .then((token) => {
        if (!token) {
          setIsProfileReady(true);
          setSkipBiometrics(true);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  const authorise = async (
    userData: UsersMeResponse,
    skipBiometrics: boolean = false
  ) => {
    try {
      if (!skipBiometrics) {
        const auth = await LocalAuthentication.authenticateAsync({
          promptMessage: "Login to Plink",
          fallbackLabel: "Enter Password",
        });

        if (!auth.success) {
          throw new Error(auth.error);
        }
      }

      if (!userData.username) {
        router.push("/onboarding");
      } else {
        router.push("/app/home");
      }
    } catch (error) {
      console.log("Authentication failed", error);
    }
  };

  const fetchUserData = async (token: string) => {
    try {
      const userData = await getMe(token);
      setUser({ ...userData, token } as DBUser);
      setIsProfileReady(true);

      return userData;
    } catch (error) {
      console.log("An error occured", error);
      await SecureStore.deleteItemAsync(`token-${address}`);
      await logout();
      setIsLoading(false);
      setIsProfileReady(true);
      setSkipBiometrics(true);
    }
  };

  const getToken = async (address: string) => {
    const token = await SecureStore.getItemAsync(`token-${address}`);
    if (token) {
      const userData = await fetchUserData(token);
      if (!userData) return;
      await authorise(userData, skipBiometrics);
    }
  };

  if (!isReady || !isProfileReady) {
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
        <View className="px-16">
          <Text
            className={`text-white text-xl text-center leading-tight font-semibold`}
          >
            Your USDC shortcut.
          </Text>
        </View>
      </View>

      {isLoading && skipBiometrics && (
        <View className="flex flex-col space-y-8">
          <ActivityIndicator animating={true} color={"#FF238C"} />
          <Text className="text-primary font-medium text-lg text-center ">
            {loadingMessage}
          </Text>
        </View>
      )}

      {isReady && user && !skipBiometrics && (
        <View className="w-full">
          <AppButton
            onPress={() => authorise(storedUser as UsersMeResponse)}
            text="Unlock"
          />
        </View>
      )}

      {isReady && skipBiometrics && (
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
