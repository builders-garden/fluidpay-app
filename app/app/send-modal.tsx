import { View } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Appbar } from "react-native-paper";
import { Text } from "react-native";
import { useSendStore, useUserStore } from "../../store";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../components/app-button";
import { AmountChooser } from "../../components/amount-chooser";
import Avatar from "../../components/avatar";
import { ArrowLeft } from "lucide-react-native";
import { createPayment } from "../../lib/api";
import tokens from "../../constants/tokens";
import { formatBigInt, shortenAddress } from "../../lib/utils";
import {
  useBiconomySmartAccount,
  useERC20BalanceOf,
  useERC20Transfer,
  usePrivyWagmiProvider,
} from "@buildersgarden/privy-wagmi-provider";
import { useChainStore } from "../../store/use-chain-store";
import { TransactionReceipt } from "viem";

export default function SendModal() {
  const { amount: paramsAmount = 0, user: sendUserData } =
    useLocalSearchParams();
  const sendUser = JSON.parse(sendUserData as string);
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);
  const chain = useChainStore((state) => state.chain);
  const transfer = useERC20Transfer({
    network: chain.id,
    address: tokens.USDC[chain.id] as `0x${string}`,
  });
  const [amount, setAmount] = useState(paramsAmount as number);
  const [isLoadingTransfer, setIsLoadingTransfer] = useState(false);
  const { address } = usePrivyWagmiProvider();
  const { balance, isLoading: isLoadingBalance } = useERC20BalanceOf({
    network: chain.id,
    args: [address!],
    address: tokens.USDC[chain.id] as `0x${string}`,
  });

  const canSend = Number(amount) <= Number(balance) && Number(amount) > 0;
  // const canSend = true;
  const sendTokens = async () => {
    if (!amount || amount < 0) return;
    setIsLoadingTransfer(true);
    const txReceipt = await transfer!({
      to: sendUser!.address as `0x${string}`,
      amount: BigInt(amount * 10 ** 6),
      waitForTx: true,
    });
    const payment = {
      payerId: user!.id,
      payeeId: sendUser!.id,
      chainId: chain.id,
      amount: amount,
      description: "",
      txHash: (txReceipt as TransactionReceipt)
        .transactionHash as `0x${string}`,
    };

    console.log(txReceipt);
    await createPayment(user!.token, payment);
    setIsLoadingTransfer(false);

    router.back();
  };

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
      <View className="flex flex-col items-center mt-4 space-y-2">
        <Avatar name={sendUser?.username.charAt(0).toUpperCase()} size={72} />
        <Text className="text-white text-3xl text-center font-semibold">
          @{sendUser?.username}
        </Text>
        <Text className="text-[#8F8F91] text-lg text-ellipsis">
          {shortenAddress(sendUser?.address)}
        </Text>

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
          <ActivityIndicator animating={true} color={"#667DFF"} />
        ) : (
          <View className="flex flex-col px-4">
            <View className="mb-4">
              <AppButton
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
    </View>
  );
}
