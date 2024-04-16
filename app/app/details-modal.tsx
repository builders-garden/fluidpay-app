import { Link, router } from "expo-router";
import { Image, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../store";
import { ArrowLeft, Copy } from "lucide-react-native";
import { BigNumber } from "ethers";

import * as Clipboard from "expo-clipboard";
import { TouchableOpacity } from "react-native-gesture-handler";
import tokens from "../../constants/tokens";

import { formatBigInt, shortenAddress } from "../../lib/utils";
import { useChainStore } from "../../store/use-chain-store";
import { useGetUserSmartAccounts, useGetSmartAccountBalance } from "@sefu/react-sdk";

export default function DetailsModal() {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);
  const chain = useChainStore((state) => state.chain);

  const { smartAccountList, error } = useGetUserSmartAccounts();
  const {
    data: fkeyBalance,
    refetch: refetchFkeyBalance,
    isLoading: isLoadingBalance,
  } = useGetSmartAccountBalance({
    idSmartAccount: smartAccountList ? smartAccountList[0].idSmartAccount : "",
    chainId: chain.id,
  });
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

  return (
    <SafeAreaView
      className="flex-1 flex-col bg-[#161618]"
      edges={{ top: "off" }}
    >
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header
        elevated={false}
        statusBarHeight={0}
        className="bg-[#161618] text-white"
      >
        <Appbar.Action
          icon={() => <ArrowLeft size={20} color="#FFF" />}
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
      <View className="flex px-4 h-full space-y-8">
        <View className="flex flex-row items-center justify-between space-x-2">
          <View className="flex space-y-2">
            <Text className="text-3xl text-white font-bold">
              {isLoadingBalance ? "Loading..." : `${fkeyUsdcBalance}`}
            </Text>
            <Text className="text-white text-lg font-semibold">
              {chain.name} • USDC
            </Text>
          </View>

          <Image
            className="h-16 w-16"
            source={require("../../images/usdc.png")}
          />
        </View>
        <View className="bg-[#232324] w-full mx-auto rounded-xl p-4 space-y-4">
          <View className="flex flex-row items-center justify-between">
            <View className="flex space-y-2">
              <Text className="text-gray-400 text-lg font-medium">
                Beneficiary
              </Text>
              <TouchableOpacity
                onPress={() => Clipboard.setStringAsync(user!.username)}
              >
                <Text className="text-[#0061FF] text-lg font-medium">
                  {user?.username}
                </Text>
              </TouchableOpacity>
            </View>

            <Copy size={20} color="#0061FF" />
          </View>
          <View className="flex flex-row items-center justify-between">
            <View className="flex space-y-2">
              <Text className="text-gray-400 text-lg font-medium">Address</Text>
              <Text className="text-[#0061FF] text-lg font-medium">
                {shortenAddress(user?.smartAccountAddress!)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                Clipboard.setStringAsync(user!.smartAccountAddress)
              }
            >
              <Copy size={20} color="#0061FF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
