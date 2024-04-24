import { KeyboardAvoidingView, View } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Appbar } from "react-native-paper";
import { Text } from "react-native";
import { useTransactionsStore, useUserStore } from "../../store";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../components/app-button";
import { AmountChooser } from "../../components/amount-chooser";
import Avatar from "../../components/avatar";
import { ArrowLeft } from "lucide-react-native";
import {
  createPayment,
  getPayments,
  getUserByIdUsernameOrAddress,
} from "../../lib/api";
import tokens from "../../constants/tokens";
import { formatBigInt, shortenAddress } from "../../lib/utils";
import {
  useERC20BalanceOf,
  usePrivyWagmiProvider,
} from "@buildersgarden/privy-wagmi-provider";
import { useChainStore } from "../../store/use-chain-store";
import { getPimlicoSmartAccountClient, transferUSDC } from "../../lib/pimlico";
import { useEmbeddedWallet } from "@privy-io/expo";

export default function SendModal() {
  const { amount: paramsAmount = 0, user: sendUserData } =
    useLocalSearchParams();
  const sendUser = JSON.parse(sendUserData as string);
  const isPresented = router.canGoBack();
  const chain = useChainStore((state) => state.chain);
  const user = useUserStore((state) => state.user);
  const [sendUserAddress, setSendUserAddress] = useState<string | null>(
    sendUser?.smartAccountAddress
  );
  const [amount, setAmount] = useState(Number(paramsAmount) as number);
  const [isLoadingTransfer, setIsLoadingTransfer] = useState(false);
  const { address } = usePrivyWagmiProvider();
  const {
    balance,
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
  } = useERC20BalanceOf({
    network: chain.id,
    args: [user!.smartAccountAddress],
    address: tokens.USDC[chain.id] as `0x${string}`,
  });
  const setTransactions = useTransactionsStore(
    (state) => state.setTransactions
  );
  const wallet = useEmbeddedWallet();
  const canSend =
    Number(amount) <= Number(balance) && Number(amount) > 0 && sendUserAddress;
  const sendTokens = async () => {
    if (!amount || amount < 0) return;
    setIsLoadingTransfer(true);
    const smartAccountClient = await getPimlicoSmartAccountClient(
      address as `0x${string}`,
      chain,
      wallet
    );
    const txHash = await transferUSDC(
      smartAccountClient,
      amount,
      chain,
      sendUser!.smartAccountAddress
    );

    const payment = {
      payerId: user!.id,
      payeeId: sendUser!.id,
      chainId: chain.id,
      amount: amount,
      description: "",
      txHash,
    };
    await createPayment(user!.token, payment);
    setIsLoadingTransfer(false);

    router.back();

    // Refetch transactions
    const res = await getPayments(user!.token, {
      limit: 10,
      chainId: chain.id,
    });
    setTransactions(res as any[]);

    // Refetch balance
    await refetchBalance();
  };

  useEffect(() => {
    console.log("sendUserAddress", sendUserAddress);
    if (!sendUserAddress) {
      getUserByIdUsernameOrAddress(user?.token!, {
        idOrUsernameOrAddress: sendUser?.username,
      }).then((result) => {
        if (result) {
          setSendUserAddress(result.smartAccountAddress!);
        }
      });
    }
  }, []);

  if (!sendUser) {
    return <View className="flex-1 flex-col px-4 bg-black"></View>;
  }

  return (
    <View className="flex-1 flex-col bg-[#161618]">
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header
        elevated={false}
        statusBarHeight={0}
        className="bg-[#161618] text-white"
      >
        <Appbar.Action
          icon={() => <ArrowLeft size={24} color="#FFF" />}
          onPress={() => {
            router.back();
          }}
          color="#fff"
          size={20}
        />
        <Appbar.Content
          title=""
          color="#fff"
          titleStyle={{ fontWeight: "bold" }}
        />
      </Appbar.Header>
      <KeyboardAvoidingView className="w-full flex-1" behavior="padding">
        <View className="flex flex-col items-center mt-4 space-y-2">
          <Avatar name={sendUser?.username.charAt(0).toUpperCase()} size={72} />
          <Text className="text-white text-3xl text-center font-semibold">
            @{sendUser?.username}
          </Text>
          {sendUserAddress ? (
            <Text className="text-[#8F8F91] text-lg text-ellipsis">
              {shortenAddress(sendUserAddress!)}
            </Text>
          ) : (
            <ActivityIndicator animating={true} color={"#8F8F91"} />
          )}

          <AmountChooser
            dollars={amount}
            onSetDollars={setAmount}
            showAmountAvailable
            autoFocus={paramsAmount ? false : true}
            lagAutoFocus={false}
          />
          {isLoadingBalance ? (
            <ActivityIndicator animating={true} color={"#667DFF"} />
          ) : (
            <Text className="text-[#8F8F91] font-semibold">
              ${formatBigInt(balance!, 2)} available
            </Text>
          )}
        </View>
        <SafeAreaView className="mt-auto">
          {isLoadingBalance || isLoadingTransfer ? (
            <View className="flex flex-col space-y-4">
              <ActivityIndicator animating={true} color={"#667DFF"} />
              {isLoadingTransfer ? (
                <Text className="text-primary text-center mt-4">
                  Sending...
                </Text>
              ) : null}
            </View>
          ) : (
            <View className="flex flex-col px-4">
              <View className="mb-4">
                <AppButton
                  disabled={!canSend}
                  text={"Send"}
                  onPress={() => sendTokens()}
                  variant={canSend ? "primary" : "disabled"}
                />
              </View>
              <AppButton
                text="Cancel"
                onPress={() => {
                  router.back();
                }}
                variant="ghost"
              />
            </View>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
