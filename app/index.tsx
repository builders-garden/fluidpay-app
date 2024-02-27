import { Image, SafeAreaView, Text, View } from "react-native";
import {
  ConnectWallet,
  darkTheme,
  useAddress,
  useConnectionStatus,
  useSigner,
} from "@thirdweb-dev/react-native";
import { ActivityIndicator } from "react-native-paper";
import { useEffect } from "react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useGroupsStore, useTransactionsStore, useUserStore } from "../store";
import {
  getAuthNonce,
  getGroups,
  getMe,
  getPayments,
  signIn,
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

  useEffect(() => {
    if (connectionStatus === "connected" && address) {
      handleConnection();
    }
  }, [connectionStatus, address]);

  const handleConnection = async () => {
    // await SecureStore.deleteItemAsync(`onboarding-${address}`);
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
    const [userData, payments, groups] = await Promise.all([
      getMe(token),
      getPayments(token, { limit: 10 }),
      getGroups(token),
    ]);
    setUser({ ...userData, token } as DBUser);
    setTransactions(payments as any[]);
    setGroups(groups);
    router.push("/app/home");
  };

  return (
    <SafeAreaView className="flex-1 items-center space-y-3">
      <Image className="mt-24" source={require("../images/crumina.png")} />
      <View className="px-24">
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
