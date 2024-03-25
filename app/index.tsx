import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useGroupsStore, useTransactionsStore, useUserStore } from "../store";
import {
  useEmbeddedWallet,
  useLoginWithEmail,
  usePrivy,
  isNotCreated,
  PrivyEmbeddedWalletProvider,
  usePrivyClient,
} from "@privy-io/expo";
import { useEffect, useRef, useState } from "react";
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
  const { isReady } = usePrivy();
  const { address } = usePrivyWagmiProvider();
  const [email, setEmail] = useState<string>();
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const setUser = useUserStore((state) => state.setUser);
  const setTransactions = useTransactionsStore(
    (state) => state.setTransactions
  );
  const setGroups = useGroupsStore((state) => state.setGroups);
  const wallet = useEmbeddedWallet();
  const { state, sendCode, loginWithCode } = useLoginWithEmail();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [code, setCode] = useState(Array(6).fill(""));

  const inputRefs = useRef<TextInput[]>([]);

  const handleInputChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text) {
      inputRefs.current[index + 1]?.focus();
    } else if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    (inputRefs.current[0] as TextInput)?.focus();
  }, []);

  useEffect(() => {
    if (state.status === "done") {
      try {
        setIsLoading(true);
        handleConnection();
      } catch (e) {
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
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
      setLoadingMessage("Creating wallet...");
      await wallet.create!();
    }
    setLoadingMessage("Connecting wallet...");
    const { message, nonce } = await getAuthNonce();
    const signedMessage = await signMessage(
      await wallet.getProvider!(),
      message as `0x${string}`
    );
    const { isNewUser, token } = await signIn({
      address: address!,
      signature: signedMessage!,
      nonce,
    });
    await SecureStore.setItemAsync(`token-${address}`, token);
    if (isNewUser) {
      return router.push("/onboarding");
    }
    setLoadingMessage("Fetching user data...");
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
  const validateEmail = (email: string) => {
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
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
      {isLoading && (
        <View className="flex flex-col space-y-8">
          <ActivityIndicator animating={true} color={"#0061FF"} />
          <Text className="text-blue-600 font-medium text-lg text-center ">
            {loadingMessage}
          </Text>
        </View>
      )}
      {isReady && (
        <>
          <View className="flex flex-col items-center space-y-3 w-full mb-12">
            {state.status === "initial" && (
              <View className="w-full">
                <View className="w-full flex flex-col space-y-1 mb-4">
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    inputMode="email"
                    clearButtonMode="while-editing"
                    placeholder="youremail@example.com"
                    placeholderTextColor={"#8F8F91"}
                    className=" text-white bg-[#232324] px-3 py-4 rounded-lg"
                  />
                  {!isEmailValid && (
                    <Text className="text-red-500 text-sm">
                      Please enter a valid email
                    </Text>
                  )}
                </View>
                <AppButton
                  // Keeps button disabled while code is being sent
                  disabled={state.status !== "initial" || email?.length === 0}
                  onPress={() => {
                    if (!validateEmail(email!)) {
                      setIsEmailValid(false);
                      return;
                    }
                    setIsLoading(true);
                    setLoadingMessage("Sending code...");
                    sendCode({ email: email! });
                    setLoadingMessage("false");
                    setIsLoading(false);
                    setCode(Array(6).fill(""));
                  }}
                  variant={state.status !== "initial" ? "disabled" : "primary"}
                  text="Login with Email"
                />
              </View>
            )}

            {state.status === "sending-code" && (
              //  Shows only while the code is sending
              <Text>Sending Code...</Text>
            )}

            {state.status === "awaiting-code-input" && (
              <View className="w-full flex flex-col">
                <Text className="text-white text-xl text-center mb-4">
                  We sent a code to {email}
                </Text>
                <View className="flex flex-row mb-4 space-x-4 justify-around">
                  {code.map((value, index) => (
                    <TextInput
                      key={index}
                      value={value}
                      onChangeText={(text) => handleInputChange(text, index)}
                      maxLength={1}
                      keyboardType="numeric"
                      ref={(el: TextInput) =>
                        ((inputRefs.current[index] as TextInput) =
                          el as TextInput)
                      }
                      className="text-4xl text-center basis-1/6 text-white bg-[#232324] py-4 rounded-lg placeholder-white"
                    />
                  ))}
                </View>

                <AppButton
                  // Keeps button disabled until the code has been sent
                  disabled={
                    state.status !== "awaiting-code-input" &&
                    code.join("").length === 6
                  }
                  onPress={async () => {
                    setIsLoading(true);
                    setLoadingMessage("Sending code...");
                    await loginWithCode({ code: code.join("") });
                    setIsLoading(false);
                    setLoadingMessage("");
                  }}
                  text="Enter code"
                  variant={
                    state.status === "awaiting-code-input" &&
                    code?.join("").length === 6
                      ? "primary"
                      : "disabled"
                  }
                />
                <Text
                  className="mt-8 text-blue-500 text-center font-bold"
                  onPress={() => sendCode({ email: email! })}
                >
                  Didn&apos;t receive anything? Send again
                </Text>
                <Text
                  className="mt-4 text-gray-500 text-center font-semibold"
                  onPress={() => {
                    router.replace("/");
                  }}
                >
                  Change email
                </Text>
              </View>
            )}

            {state.status === "error" && (
              <View className="w-full">
                <AppButton
                  onPress={() => {
                    setEmail("");
                    setCode(Array(6).fill(""));
                  }}
                  text="Logout"
                />
              </View>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Home;
