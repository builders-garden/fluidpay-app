import {
  SafeAreaView,
  View,
  Text,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import AppButton from "../components/app-button";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { usePrivyWagmiProvider } from "@buildersgarden/privy-wagmi-provider";
import PinInput from "../components/login/pin-input";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  useAuthenticate,
  useGenerateKeys,
  useGetUser,
  useGetUserSmartAccounts,
  useIsAddressRegistered,
  useRegisterUser,
  useSetUsername,
} from "@sefu/react-sdk";
import { getWalletClient } from "../lib/smart-accounts";
import { useChainStore } from "../store/use-chain-store";
import { useEmbeddedWallet } from "@privy-io/expo";
import { UserImportStatus } from "@sefu/react-sdk/lib/core/graphql/codegen/generatedTS/graphql";
import { useUserStore } from "../store";

export default function Pin() {
  const [isLoading, setIsLoading] = useState(true);
  const user = useUserStore((state) => state.user);
  const chain = useChainStore((state) => state.chain);
  const wallet = useEmbeddedWallet();
  const { address } = usePrivyWagmiProvider();
  const [pin, setPin] = useState(Array(4).fill(""));
  const [storedPin, setStoredPin] = useState<string | null>(null);
  const [hasPin, setHasPin] = useState(false);
  const [pinError, setPinError] = useState(false);
  const { registerUser } = useRegisterUser();
  const { authenticate } = useAuthenticate();
  const { setUsername } = useSetUsername();
  const { smartAccountList } = useGetUserSmartAccounts();

  const { user: fkeyUser } = useGetUser({
    pollingOnStatusImporting: true,
  });

  const { isAddressRegistered } = useIsAddressRegistered(
    address as `0x${string}`
  );
  const { generateKeys } = useGenerateKeys();

  useEffect(() => {
    SecureStore.getItemAsync(`pin-${address}`).then((pin) => {
      if (pin) {
        setHasPin(true);
        setStoredPin(pin);
      }
      setIsLoading(false);
    });
  }, []);

  const storePin = async () => {
    const pinString = pin.join("");
    await SecureStore.setItemAsync(`pin-${address}`, pinString);
    setStoredPin(pinString);
    checkPin();
  };

  const checkPin = async () => {
    setIsLoading(true);
    const pinString = pin.join("");
    console.log({
      pinString,
      storedPin,
    });
    if (pinString === storedPin) {
      const walletClient = getWalletClient(address!, chain, wallet);
      // @ts-expect-error
      await generateKeys(walletClient, pinString);
      if (isAddressRegistered) {
        await authenticate();
        console.log("authenticated!");
        router.push("/app/home");
        setIsLoading(false);
      } else {
        // @ts-expect-error
        await registerUser({ walletClient, whitelistCode: "SCC5IT" });
      }
    } else {
      setPinError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      fkeyUser?._importStatus === UserImportStatus.Success &&
      smartAccountList &&
      smartAccountList?.length > 0 &&
      !hasPin
    ) {
      setIsLoading(true);
      // TODO: check if username is available with useIsUsernameAvailable
      setUsername(smartAccountList[0].idSmartAccount, user?.username!)
        .then(() => {
          router.push("/app/home");
          setIsLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setIsLoading(false);
        });
    }
  }, [fkeyUser, smartAccountList]);
  return (
    <SafeAreaView className="flex-1 bg-black px-4">
      {isLoading && (
        <View className="flex flex-col mx-auto my-auto justify-center items-center space-y-4">
          <ActivityIndicator color="blue" />
          <Text className="text-primary text-lg font-semibold">
            {hasPin ? "Summoning unicorns" : "Baking digital cookies..."}
          </Text>
        </View>
      )}
      {!isLoading && (
        <KeyboardAvoidingView
          className="w-full px-4 flex flex-1 flex-col text-left justify-between mb-12"
          behavior="padding"
        >
          <View className="flex flex-col space-y-8">
            <View className="flex flex-col space-y-2">
              <Text className="text-3xl text-white font-bold text-left">
                {hasPin ? "Enter your PIN" : "Set your PIN"}
              </Text>
              <Text className="text-white text-left">
                {hasPin
                  ? "Please enter your 4-digit PIN to continue"
                  : "Please set a 4-digit PIN to secure your account"}
              </Text>
              {pinError && (
                <View className="bg-red-500/10  rounded-lg flex flex-row space-x-2 p-4 items-center">
                  <Icon name={"error"} color="red" size={24} />
                  <Text className="text-red-500 text-left">
                    Incorrect PIN, please try again!
                  </Text>
                </View>
              )}
            </View>

            <View className="flex flex-col space-y-2 text-left">
              <PinInput pin={pin} setPin={setPin} />
            </View>
          </View>
          <AppButton
            text={hasPin ? "Enter" : "Set"}
            onPress={hasPin ? checkPin : storePin}
            disabled={pin.join("").length < 4}
          />
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
