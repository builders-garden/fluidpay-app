import { Link, router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../store";
import { ArrowLeft, Copy } from "lucide-react-native";
import { BigNumber } from "ethers";

import * as Clipboard from "expo-clipboard";
import tokens from "../../constants/tokens";

import {
  usePrivyWagmiProvider,
  useERC20BalanceOf,
} from "@buildersgarden/privy-wagmi-provider";
import { formatBigInt, shortenAddress } from "../../lib/utils";
import { useChainStore } from "../../store/use-chain-store";

export default function DetailsModal() {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);
  const chain = useChainStore((state) => state.chain);

  const { balance, isLoading: isLoadingBalance } = useERC20BalanceOf({
    network: chain.id,
    args: [user!.smartAccountAddress],
    address: tokens.USDC[chain.id] as `0x${string}`,
  });

  return (
    <SafeAreaView
      className="flex-1 flex-col bg-darkGrey"
      edges={{ top: "off" }}
    >
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header
        elevated={false}
        statusBarHeight={0}
        className="bg-darkGrey text-darkGrey dark:text-white"
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
            <Text className="text-3xl text-darkGrey dark:text-white font-bold">
              {isLoadingBalance ? "Loading..." : `${formatBigInt(balance!, 2)}`}
            </Text>
            <Text className="text-darkGrey dark:text-white text-lg font-semibold">
              {chain.name} • USDC
            </Text>
          </View>

          <Image
            className="h-16 w-16"
            source={require("../../images/usdc.png")}
          />
        </View>
        <View className="bg-white dark:bg-[#232324] w-full mx-auto rounded-xl p-4 space-y-4">
          <View className="flex flex-row items-center justify-between">
            <View className="flex space-y-2">
              <Text className="text-gray-400 text-lg font-medium">
                Beneficiary
              </Text>
              <TouchableOpacity
                onPress={() => Clipboard.setStringAsync(user!.username)}
              >
                <Text className="text-[#FF238C] text-lg font-medium">
                  {user?.username}
                </Text>
              </TouchableOpacity>
            </View>

            <Copy size={20} color="#FF238C" />
          </View>
          <View className="flex flex-row items-center justify-between">
            <View className="flex space-y-2">
              <Text className="text-gray-400 text-lg font-medium">Address</Text>
              <Text className="text-[#FF238C] text-lg font-medium">
                {shortenAddress(user?.smartAccountAddress!)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                Clipboard.setStringAsync(user!.smartAccountAddress)
              }
            >
              <Copy size={20} color="#FF238C" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
