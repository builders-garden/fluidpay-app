import { Image, SafeAreaView, Text, TextInput, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useGroupsStore, useTransactionsStore, useUserStore } from "../store";
import {
  useEmbeddedWallet,
  useLoginWithEmail,
  usePrivy,
  isNotCreated,
  EmbeddedWalletState,
  PrivyEmbeddedWalletProvider,
} from "@privy-io/expo";
import { useEffect, useState } from "react";
import AppButton from "../components/app-button";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  getAuthNonce,
  signIn,
  getMe,
  getPayments,
  getGroups,
} from "../lib/api";
import { DBUser } from "../store/interfaces";
import { usePrivyWagmiProvider } from "@buildersgarden/privy-wagmi-provider";

const Home = () => {
  // const connectionStatus = useConnectionStatus();
  // const address = useAddress();
  // const signer = useSigner();
  const { isReady, logout } = usePrivy();
  const { address } = usePrivyWagmiProvider();
  const [email, setEmail] = useState<string>();
  const setUser = useUserStore((state) => state.setUser);
  const setTransactions = useTransactionsStore(
    (state) => state.setTransactions
  );
  const setGroups = useGroupsStore((state) => state.setGroups);
  const wallet = useEmbeddedWallet();
  const [code, setCode] = useState("");
  const { state, sendCode, loginWithCode } = useLoginWithEmail();

  useEffect(() => {
    if (state.status === "done") {
      handleConnection();
    }
  }, [state]);

  const signMessage = async (
    provider: PrivyEmbeddedWalletProvider,
    message: `0x${string}`
  ) => {
    // Get the wallet address
    const accounts = await provider.request({
      method: "eth_requestAccounts",
    });

    return await provider.request({
      method: "personal_sign",
      params: [message, accounts[0]],
    });
  };

  const handleConnection = async () => {
    if (isNotCreated(wallet)) {
      console.log("Creating wallet");
      await wallet.create!();
      console.log("Wallet created");
    }
    console.log("Getting nonce");
    const { message, nonce } = await getAuthNonce();
    console.log("Signing message");
    const signedMessage = await signMessage(
      await wallet.getProvider!(),
      message as `0x${string}`
    );
    console.log("Signing message done", signedMessage);
    const { isNewUser, token } = await signIn({
      address: address!,
      signature: signedMessage!,
      nonce,
    });
    console.log({ isNewUser, token });
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
    <SafeAreaView className="flex flex-1 justify-between items-center space-y-3 mx-4">
      <View>
        <Image className="mt-24" source={require("../images/crumina.png")} />
        <View className="px-16">
          <Text
            className={`text-[#0061FF] text-2xl text-center leading-tight font-semibold`}
          >
            Crypto made simple, payments made easy.
          </Text>
        </View>
      </View>
      {!isReady && <ActivityIndicator animating={true} color={"#0061FF"} />}
      {isReady && (
        <>
          <View className="flex flex-col items-center space-y-3 w-full mb-12 mx-4">
            {state.status === "initial" && (
              <View className="w-full">
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                  autoFocus={true}
                  placeholder="youremail@example.com"
                  className="mb-4 text-white bg-[#232324] px-3 py-4 rounded-lg placeholder-[#8F8F91]"
                />
                <AppButton
                  // Keeps button disabled while code is being sent
                  disabled={state.status !== "initial" || email?.length === 0}
                  onPress={() => {
                    console.log(
                      "sending code",
                      state.status !== "initial" || email?.length === 0
                    );
                    sendCode({ email: email! });
                  }}
                  variant={
                    state.status !== "initial" || email?.length === 0
                      ? "disabled"
                      : "primary"
                  }
                  text="Login with Email"
                />
              </View>
            )}

            {state.status === "sending-code" && (
              //  Shows only while the code is sending
              <Text>Sending Code...</Text>
            )}

            {state.status === "awaiting-code-input" && (
              <View className="w-full">
                <TextInput
                  onChangeText={setCode}
                  className="mb-4 text-white bg-[#232324] px-3 py-4 rounded-lg placeholder-[#8F8F91]"
                />
                <AppButton
                  // Keeps button disabled until the code has been sent
                  disabled={state.status !== "awaiting-code-input"}
                  onPress={() => {
                    loginWithCode({ code });
                  }}
                  text="Enter code"
                  variant={
                    state.status === "awaiting-code-input" && code?.length > 0
                      ? "primary"
                      : "disabled"
                  }
                />
              </View>
            )}

            {state.status === "submitting-code" && (
              // Shows only while the login is being attempted
              <Text>Logging in...</Text>
            )}

            {state.status === "error" && (
              <AppButton onPress={() => logout()} text="Logout" />
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Home;
