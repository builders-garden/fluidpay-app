import { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Avatar from "../avatar";
import AppButton from "../app-button";
import { router } from "expo-router";
import { getPimlicoSmartAccountClient, transferUSDC } from "../../lib/pimlico";
import { createPayment } from "../../lib/api";
import { DBTransaction, DBUser } from "../../store/interfaces";
import { useTransactionsStore } from "../../store";
import { Chain } from "viem";
import { useEmbeddedWallet } from "@privy-io/expo";
import { formatBigInt } from "../../lib/utils";
import { useColorScheme } from "nativewind";
import tokens from "../../constants/tokens";
import { createAndPayRequest } from "../../lib/request-network/create-and-pay-request";
import { getWalletClient } from "../../lib/smart-accounts";
import { walletClientToSmartAccountSigner } from "permissionless";

const sceenHeight = Dimensions.get("window").height;

type SendConfirmationProps = {
  sendUser: any;
  amount: number;
  address: `0x${string}` | undefined;
  chain: Chain;
  note: string;
  user: DBUser | undefined;
  balance: bigint | undefined;
  setIsLoadingTransfer: (isLoading: boolean) => void;
  cancelTransaction: () => void;
  refetchBalance: () => Promise<any>;
  isLoadingBalance: boolean;
  isLoadingTransfer: boolean;
  bottomSheetRef: React.RefObject<BottomSheet>;
};

const SendConfirmation = ({
  sendUser,
  amount,
  address,
  chain,
  note,
  user,
  balance,
  isLoadingBalance,
  isLoadingTransfer,
  bottomSheetRef,
  setIsLoadingTransfer,
  refetchBalance,
  cancelTransaction,
}: SendConfirmationProps) => {
  const { colorScheme } = useColorScheme();

  const snapPoints = useMemo(() => ["50%"], []);

  const wallet = useEmbeddedWallet();

  const { transactions, setTransactions } = useTransactionsStore(
    (state) => state
  );

  const [sendUserAddress, setSendUserAddress] = useState<string | null>(
    sendUser?.smartAccountAddress
  );

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const sendTokens = async () => {
    if (!amount || amount < 0) return;
    if (Number(amount) > Number(formatBigInt(balance ?? BigInt(0)))) {
      alert("Insufficient balance");
      return;
    }
    setIsLoadingTransfer(true);
    const smartAccountClient = await getPimlicoSmartAccountClient(
      address!,
      chain,
      wallet
    );
    const provider = await wallet.getProvider!();
    /*
    const txHash = await transferUSDC(
      smartAccountClient,
      amount,
      chain,
      sendUser?.smartAccountAddress
    );
    */
    const request = await createAndPayRequest(
      {
        payeeIdentity: sendUserAddress!,
        payerIdentity: address!,
        // signerIdentity: user!.address,
        signerIdentity: address!,
        amount,
        expectedAmount: amount * 10 ** 6,
        paymentAddress: sendUserAddress!,
        reason: "Reason",
        currencyAddress: tokens.USDC[chain.id] as `0x${string}`,
        chain,
      },
      provider,
      smartAccountClient,
      chain
    );

    console.log("Request created", request.requestId);

    const payment = {
      payerId: user!.id,
      payeeId: sendUser!.id,
      chainId: chain.id,
      amount: amount,
      description: note,
      txHash: request.hash as `0x${string}`,
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

  // renders
  return (
    <View
      className="flex-1 p-6 bg-black/70 absolute w-full bottom-0 z-10"
      style={{ height: sceenHeight }}
    >
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose={true}
        onClose={cancelTransaction}
        onChange={handleSheetChanges}
        handleIndicatorStyle={{
          backgroundColor: "#232324",
          width: 165,
          height: 6,
          top: 5,
        }}
        backgroundStyle={{
          backgroundColor: colorScheme === "dark" ? "#161618" : "#fff",
        }}
      >
        <BottomSheetView
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <View className="w-full flex-1 pb-10">
            <View className="flex flex-col items-center mt-5">
              <Avatar
                name={sendUser?.displayName.charAt(0).toUpperCase()}
                uri={sendUser?.avatarUrl}
                size={50}
              />
              <Text className="text-darkGrey dark:text-white text-xl mt-2.5 mb-1 text-center font-medium">
                {sendUser?.displayName}
              </Text>
              <Text className="text-mutedGrey text-base text-center font-medium">
                @{sendUser?.username}
              </Text>
            </View>

            <View className="mt-auto">
              <Text className="text-center text-darkGrey dark:text-white text-[40px] leading-[48px] font-medium">
                ${amount}
              </Text>
              <Text className="text-center text-mutedGrey text-base font-medium">
                {note}
              </Text>
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
                  <View className="mb-2.5">
                    <AppButton
                      text={"Confirm"}
                      onPress={() => sendTokens()}
                      variant={"primary"}
                    />
                  </View>
                  <AppButton
                    text="Cancel"
                    onPress={cancelTransaction}
                    variant="ghost"
                  />
                </View>
              )}
            </SafeAreaView>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default SendConfirmation;
