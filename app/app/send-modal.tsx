import { KeyboardAvoidingView, View } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Appbar } from "react-native-paper";
import { Text } from "react-native";
import { useUserStore } from "../../store";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../components/app-button";
import { AmountChooser } from "../../components/amount-chooser";
import Avatar from "../../components/avatar";
import { ArrowLeft } from "lucide-react-native";
import { createPayment, getUserByIdUsernameOrAddress } from "../../lib/api";
import tokens, { idTokens } from "../../constants/tokens";
import { formatBigInt, resolveEnsName, shortenAddress } from "../../lib/utils";
import {
  useERC20BalanceOf,
  usePrivyWagmiProvider,
} from "@buildersgarden/privy-wagmi-provider";
import { useChainStore } from "../../store/use-chain-store";
import { getPimlicoSmartAccountClient, transferUSDC } from "../../lib/pimlico";
import { useEmbeddedWallet } from "@privy-io/expo";
import {
  useConfirmWithdrawal,
  useGenerateWithdrawalQuote,
  useGetSmartAccountBalance,
  useGetUserSmartAccounts,
} from "@sefu/react-sdk";
import { getEnsAddress } from "viem/actions";

export default function SendModal() {
  const { amount: paramsAmount = 0, user: sendUserData } =
    useLocalSearchParams();
  const sendUser = JSON.parse(sendUserData as string);
  const isPresented = router.canGoBack();
  const chain = useChainStore((state) => state.chain);
  const user = useUserStore((state) => state.user);
  const [sendUserAddress, setSendUserAddress] = useState<string | null>();
  const [sendUserDisplayName, setSendUserDisplayName] = useState<string | null>(
    sendUser?.displayName
  );
  const [amount, setAmount] = useState(Number(paramsAmount) as number);
  const [isLoadingTransfer, setIsLoadingTransfer] = useState(false);
  const { smartAccountList, error } =
    useGetUserSmartAccounts();
  const {
    data: withdrawalQuoteData,
    requestQuote,
    error: requestQuoteError,
  } = useGenerateWithdrawalQuote();
  const { confirmWithdrawal, error: confirmWithdrawalError, errorInfo, isError } =
    useConfirmWithdrawal();
  const {
    data: fkeyBalance,
    refetch: refetchFkeyBalance,
    isLoading: isLoadingBalance,
  } = useGetSmartAccountBalance({
    idSmartAccount: smartAccountList ? smartAccountList[0].idSmartAccount : "",
    chainId: chain.id,
  });
  const balance = fkeyBalance.find((b) => b.token.symbol === "USDC")
    ? fkeyBalance.find(
        (b) => b.token.symbol === "USDC" && b.token.chainId === chain.id
      )!.amount
    : 0;
  const fkeyUsdcBalance = fkeyBalance.find((b) => b.token.symbol === "USDC")
    ? formatBigInt(
        BigInt(
          fkeyBalance.find(
            (b) => b.token.symbol === "USDC" && b.token.chainId === chain.id
          )!.amount
        ),
        2
      )
    : "0.00";
  const canSend =
    Number(amount) <= Number(balance) &&
    Number(amount) > 0 &&
    sendUserAddress &&
    smartAccountList &&
    smartAccountList?.length > 0;

  const sendTokens = async () => {
    if (!amount || amount < 0) return;
    setIsLoadingTransfer(true);
    const requestQuoteResponse = await requestQuote({
      idToken: idTokens.USDC[chain.id],
      amount: BigInt(amount * 10 ** 6),
      to: sendUserAddress!,
      chainId: chain.id,
      idSmartAccount: smartAccountList![0].idSmartAccount,
      epochControlStructure: 0,
    });

    const idProcedure = requestQuoteResponse?.withdrawalProcedure?.idProcedure!;

    await confirmWithdrawal({
      idProcedure: requestQuoteResponse?.withdrawalProcedure?.idProcedure!,
    });


    const payment = {
      payerId: user!.id,
      payeeId: sendUser!.id,
      chainId: chain.id,
      amount: amount,
      description: `idProcedure:${idProcedure}`,
      // TODO: save idProcedure and not txHash
      txHash: "0xaaaa" as `0x${string}`,
    };
    await createPayment(user!.token, payment);
    setIsLoadingTransfer(false);

    router.back();
  };

  useEffect(() => {
    if (!sendUserAddress) {
      getUserByIdUsernameOrAddress(user?.token!, {
        idOrUsernameOrAddress: sendUser?.username,
      }).then((result) => {
        if (result) {
          setSendUserDisplayName(result.displayName);
        }
      });
      resolveEnsName(`${sendUser?.username}.fkeydev.eth`).then((result) => {
        if (result) {
          setSendUserAddress(result);
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
            {sendUserDisplayName}
          </Text>
          <Text className="text-[#8F8F91] text-xl text-ellipsis text-center">
            @{sendUser?.username}
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
              ${fkeyUsdcBalance} available
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
