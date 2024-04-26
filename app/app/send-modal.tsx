import { Image, KeyboardAvoidingView, TextInput, View } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Appbar } from "react-native-paper";
import { Pressable, Text } from "react-native";
import { useTransactionsStore, useUserStore } from "../../store";
import { ReactNode, useEffect, useRef, useState } from "react";
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
import { formatBigInt } from "../../lib/utils";
import {
  useERC20BalanceOf,
  usePrivyWagmiProvider,
} from "@buildersgarden/privy-wagmi-provider";
import { useChainStore } from "../../store/use-chain-store";
import { getPimlicoSmartAccountClient, transferUSDC } from "../../lib/pimlico";
import { useEmbeddedWallet } from "@privy-io/expo";
import { DBTransaction } from "../../store/interfaces";
import { base } from "viem/chains";

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
  const [note, setNote] = useState("");
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
  const { transactions, setTransactions } = useTransactionsStore(
    (state) => state
  );
  const wallet = useEmbeddedWallet();

  const noteRef = useRef<TextInput>(null);

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
    const paymentInTransaction: DBTransaction = {
      ...payment,
      payer: user!,
      payee: sendUser!,
      createdAt: new Date().toISOString(),
      id: Math.random(),
    };
    const newTransactions = [paymentInTransaction, ...transactions];
    setTransactions(newTransactions);

    // Refetch balance
    await refetchBalance();
  };

  useEffect(() => {
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
        statusBarHeight={48}
        className="bg-[#161618] text-white"
      >
        <Appbar.Action
          icon={() => <ArrowLeft size={24} color="#FFF" />}
          onPress={() => {
            router.back();
          }}
          color="#fff"
          size={20}
          animated={false}
        />
        <Appbar.Content
          title={
            (
              <View className="items-center">
                <Text className="font-semibold text-xl text-white leading-6">
                  {sendUser.displayName}
                </Text>
                <Text className="text-mutedGrey text-base leading-5">
                  @{sendUser?.username}
                </Text>
              </View>
            ) as ReactNode & string
          }
          color="#fff"
          titleStyle={{ fontWeight: "bold" }}
        />
        <Appbar.Action
          icon={() => (
            <Avatar
              name={sendUser?.username.charAt(0).toUpperCase()}
              size={37.5}
            />
          )}
          onPress={() => {}}
          color="#fff"
          size={37.5}
          animated={false}
        />
      </Appbar.Header>
      <KeyboardAvoidingView className="w-full flex-1" behavior="padding">
        <View className="flex flex-col items-center mt-8 space-y-2">
          <AmountChooser
            dollars={amount}
            onSetDollars={setAmount}
            showAmountAvailable
            autoFocus={paramsAmount ? false : true}
            lagAutoFocus={false}
            mt={false}
          />
          <Text className="mt-4 mb-3.5 text-mutedGrey text-base">No fees</Text>

          <View className="flex-row p-2.5 space-x-2.5 rounded-[20px] bg-white/20 items-center">
            <Image
              className="h-6 w-6 rounded-full"
              source={
                chain === base
                  ? require("../../images/base.png")
                  : require("../../images/sepolia.png")
              }
            />
            {isLoadingBalance ? (
              <ActivityIndicator animating={true} color={"#667DFF"} />
            ) : (
              <Text className="text-white leading-4 font-semibold">
                {chain === base ? "Base" : "Sepolia"} • $
                {formatBigInt(balance!, 2)}
              </Text>
            )}
          </View>
        </View>
        <View className="mt-auto px-4 relative">
          <Pressable
            onPress={() => noteRef.current?.focus()}
            className={`relative z-[1] left-5 transition-all duration-300 ease-in-out ${note ? "top-[30%]" : "top-[50%]"}`}
          >
            <Text
              className={`text-mutedGrey ${note ? "text-xs" : "text-base"}`}
            >
              Add note
            </Text>
          </Pressable>
          <TextInput
            className={`flex-grow text-base h-[62px] bg-greyInput rounded-2xl p-2.5 pl-5 text-white tabular-nums ${note ? "leading-[30px]" : "leading-5"}`}
            selectTextOnFocus={false}
            placeholderTextColor={"#8F8F91"}
            numberOfLines={1}
            ref={noteRef}
            value={note}
            onChangeText={setNote}
          />
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
            </View>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
