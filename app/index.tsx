import { Image, SafeAreaView, Text, TextInput, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useGroupsStore, useTransactionsStore, useUserStore } from "../store";
import { useEmbeddedWallet, useLoginWithEmail, usePrivy } from "@privy-io/expo";
import { useState } from "react";
import AppButton from "../components/app-button";

const Home = () => {
  // const connectionStatus = useConnectionStatus();
  // const address = useAddress();
  // const signer = useSigner();
  const { isReady } = usePrivy();
  const { loginWithCode, sendCode } = useLoginWithEmail();
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const setUser = useUserStore((state) => state.setUser);
  const setTransactions = useTransactionsStore(
    (state) => state.setTransactions
  );
  const setGroups = useGroupsStore((state) => state.setGroups);
  const wallet = useEmbeddedWallet();

  // useEffect(() => {
  //   if (connectionStatus === "connected" && address) {
  //     handleConnection();
  //   }
  // }, [connectionStatus, address]);

  // const handleConnection = async () => {
  //   const { message, nonce } = await getAuthNonce();
  //   const signedMessage = await signer?.signMessage(message);
  //   const { isNewUser, token } = await signIn({
  //     address: address!,
  //     signature: signedMessage!,
  //     nonce,
  //   });
  //   await SecureStore.setItemAsync(`token-${address}`, token);
  //   if (isNewUser) {
  //     return router.push("/onboarding");
  //   }
  //   // console.log(token)
  //   const [userData, payments, groups] = await Promise.all([
  //     getMe(token),
  //     getPayments(token, { limit: 10 }),
  //     getGroups(token),
  //   ]);
  //   if (!userData.username) {
  //     router.push("/onboarding");
  //   } else {
  //     setUser({ ...userData, token } as DBUser);
  //     setTransactions(payments as any[]);
  //     setGroups(groups);
  //     router.push("/app/home");
  //   }
  // };

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
      {/* {connectionStatus === "connecting" && (
        <ActivityIndicator animating={true} color={"#0061FF"} />
      )}
      <View className="flex-1" />
      {connectionStatus === "disconnected" && (
        
      )} */}
      {!isReady && <ActivityIndicator animating={true} color={"#0061FF"} />}
      {isReady && (
        <>
          {!codeSent && (
            <View className="flex-1 items-center space-y-3">
              <Text className="text-white text-2xl font-bold mb-4">Login</Text>
              <TextInput
                placeholder="Email"
                className="text-white bg-[#232324] px-3 py-4 rounded-lg placeholder-[#8F8F91]"
              />
              <AppButton
                onPress={() => {
                  sendCode({ email: "" });
                }}
                text="Send code"
              />
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default Home;
