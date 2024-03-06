import { Image, SafeAreaView, Text, View } from "react-native";
import {
  ConnectWallet,
  darkTheme,
  useAddress,
  useConnectionStatus,
  useDisconnect,
  useSigner,
} from "@thirdweb-dev/react-native";
import { ActivityIndicator } from "react-native-paper";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useGroupsStore, useTransactionsStore, useUserStore } from "../store";
import { router } from "expo-router";
import {
  getAuthNonce,
  signIn,
  getMe,
  getPayments,
  getGroups,
} from "../lib/api";
import { DBUser } from "../store/interfaces";

const theme = darkTheme({
  colors: {
    buttonBackgroundColor: "#0061FF",
    buttonTextColor: "#667DFF",
    buttonBorderColor: "#667DFF",
  },
});

const Home = () => {
  const connectionStatus = useConnectionStatus();
  const address = useAddress();
  const signer = useSigner();
  const setUser = useUserStore((state) => state.setUser);
  const setTransactions = useTransactionsStore(
    (state) => state.setTransactions
  );
  const setGroups = useGroupsStore((state) => state.setGroups);
  const disconnect = useDisconnect();

  useEffect(() => {
    if (connectionStatus === "connected" && address) {
      handleConnection();
    }
  }, [connectionStatus, address]);

  const handleConnection = async () => {
    const { message, nonce } = await getAuthNonce();
    const signedMessage = await signer?.signMessage(message);
    const { isNewUser, token } = await signIn({
      address: address!,
      signature: signedMessage!,
      nonce,
    });
    await SecureStore.setItemAsync(`token-${address}`, token);
    if (isNewUser) {
      return router.push("/onboarding");
    }
    // console.log(token)
    const [userData, payments, groups] = await Promise.all([
      getMe(token),
      getPayments(token, { limit: 10 }),
      getGroups(token),
    ]);
    if (!userData.username) {
      router.push("/onboarding");
    } else {
      setUser({ ...userData, token } as DBUser);
      setTransactions(payments as any[]);
      setGroups(groups);
      router.push("/app/home");
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center space-y-3">
      <Image className="mt-24" source={require("../images/crumina.png")} />
      <View className="px-16">
        <Text
          className={`text-[#0061FF] text-2xl text-center leading-tight font-semibold`}
        >
          Crypto made simple, payments made easy.
        </Text>
      </View>
      {/* <Text className="text-white text-4xl font-bold mb-4">Ghost</Text> */}
      {connectionStatus === "connecting" && (
        <ActivityIndicator animating={true} color={"#0061FF"} />
      )}
      <View className="flex-1" />
      {connectionStatus === "disconnected" && (
        <ConnectWallet
          modalTitle="Crumina"
          buttonTitle="Login"
          modalTitleIconUrl=""
          theme={theme}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
