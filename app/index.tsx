import { Image, SafeAreaView, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useUserStore } from "../store";
import { getUserEmbeddedWallet, usePrivy } from "@privy-io/expo";

import { useEffect, useState } from "react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { DBUser } from "../store/interfaces";
import LoginForm from "../components/login/login-form";
import { getMe } from "../lib/api";
import { useColorScheme } from "nativewind";
import { LinearGradient } from "expo-linear-gradient";
import Biometrics from "../components/login/biometrics";
import DismissKeyboardHOC from "../components/hocs/dismiss-keyboard";

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
  const { colorScheme } = useColorScheme();

  const { user: storedUser, setUser } = useUserStore((state) => state);
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [userFetchingCounter, setUserFetchingCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loginStatus, setLoginStatus] = useState<LoginStatus>(
    LoginStatus.INITIAL
  );

  const token = SecureStore.getItem(`token-${address}`);
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
      <Biometrics
        address={address!}
        user={storedUser}
        logout={logout}
        setUser={setUser}
      />
    );
  }

  return (
    <LinearGradient
      start={{ x: 0.5, y: colorScheme === "dark" ? 0.2 : 0 }}
      colors={
        colorScheme === "dark" ? ["#000000", "#000000"] : ["#F2F2F2", "#FFDBEC"]
      }
      className="h-full"
    >
      <SafeAreaView className="flex flex-1 justify-between items-center space-y-3 mx-4 bg-transparent">
        <View className="text-center flex flex-col space-y-4 justify-center items-center">
          <Image
            className="mt-24 h-14 w-56"
            source={
              colorScheme === "dark"
                ? require("../images/plink.png")
                : require("../images/plink-dark.png")
            }
          />
          <View className="px-16">
            <Text
              className={`text-darkGrey dark:text-white text-xl text-center leading-tight font-semibold`}
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
    </LinearGradient>
  );
};

export default DismissKeyboardHOC(Home);
