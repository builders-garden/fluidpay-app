import { Image, SafeAreaView, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useGroupsStore, useTransactionsStore, useUserStore } from "../store";
import { usePrivy } from "@privy-io/expo";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { DBUser } from "../store/interfaces";
import { usePrivyWagmiProvider } from "@buildersgarden/privy-wagmi-provider";
import LoginForm from "../components/login/login-form";
import { getMe, getPayments, getGroups } from "../lib/api";
import { useChainStore } from "../store/use-chain-store";
import { useAuthenticate, useIsAddressRegistered } from "@sefu/react-sdk";

export enum LoginStatus {
  INITIAL = "initial",
  EMAIL_ERROR = "email-error",
  CODE_ERROR = "code-error",
  SUCCESS_EMAIL = "email-success",
  SUCCESS_CODE = "code-success",
}

const Home = () => {
  const { isReady, user, getAccessToken } = usePrivy();
  const { address } = usePrivyWagmiProvider();
  const { isAddressRegistered } = useIsAddressRegistered(
    (address as `0x${string}`) || "0x132"
  );
  const { isAuthenticated: isFkeyAuthenticated } = useAuthenticate();
  const setUser = useUserStore((state) => state.setUser);
  const setTransactions = useTransactionsStore(
    (state) => state.setTransactions
  );
  const setGroups = useGroupsStore((state) => state.setGroups);
  const chain = useChainStore((state) => state.chain);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loginStatus, setLoginStatus] = useState<LoginStatus>(
    LoginStatus.INITIAL
  );

  useEffect(() => {
    if (address && user) {
      getToken(address);
    }
  }, [address, user]);

  useEffect(() => {
    getAccessToken()
      .then((token) => {
        if (token) {
          fetchUserData(token);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  const fetchUserData = async (token: string) => {
    const [userData, payments, groups] = await Promise.all([
      getMe(token),
      getPayments(token, { limit: 10, chainId: chain.id }),
      getGroups(token),
    ]);
    setUser({ ...userData, token } as DBUser);
    setTransactions(payments as any[]);
    setGroups(groups);
    return userData;
  };

  const getToken = async (address: string) => {
    try {
      setIsLoading(true);
      setLoadingMessage("Logging in...");
      const token = await SecureStore.getItemAsync(`token-${address}`);
      if (token) {
        const userData = await fetchUserData(token);
        if (!userData.username) {
          router.push("/onboarding");
        } else {
          router.push("/pin");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex flex-1 justify-between items-center space-y-3 mx-4">
      <View className="text-center flex flex-col space-y-4 justify-center items-center">
        <Image
          className="mt-24 h-14 w-56"
          source={require("../images/fluidpay.png")}
        />
        <View className="px-16">
          <Text
            className={`text-white text-xl text-center leading-tight font-semibold`}
          >
            To anyone, from everywhere.
          </Text>
        </View>
      </View>
      {isLoading && (
        <View className="flex flex-col space-y-8">
          <ActivityIndicator animating={true} color={"#0061FF"} />
          <Text className="text-blue-600 font-medium text-lg text-center ">
            {loadingMessage}
          </Text>
        </View>
      )}
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
