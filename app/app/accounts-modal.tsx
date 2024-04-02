import { View, Text, Image, Pressable } from "react-native";
import { Appbar } from "react-native-paper";
import { Redirect, router } from "expo-router";
import {
  useERC20BalanceOf,
  usePrivyWagmiProvider,
} from "@buildersgarden/privy-wagmi-provider";
import { useUserStore } from "../../store";
import React, { useState } from "react";
import { X } from "lucide-react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useChainStore } from "../../store/use-chain-store";
import { base, sepolia } from "viem/chains";
import tokens from "../../constants/tokens";
import { formatBigInt } from "../../lib/utils";

export default function AccountsModal() {
  const { isConnected, isReady, address } = usePrivyWagmiProvider();
  const chain = useChainStore((state) => state.chain);
  const setChain = useChainStore((state) => state.setChain);
  const [selectedChain, setSelectedChain] = useState(chain);

  const { balance: sepoliaBalance, isLoading: isLoadingSepoliaBalance } =
    useERC20BalanceOf({
      network: sepolia.id,
      args: [address!],
      address: tokens.USDC[sepolia.id] as `0x${string}`,
    });

  const { balance: baseBalance, isLoading: isLoadingBaseBalance } =
    useERC20BalanceOf({
      network: base.id,
      args: [address!],
      address: tokens.USDC[base.id] as `0x${string}`,
    });

  const user = useUserStore((state) => state.user);

  if (!isConnected || !isReady || !user) {
    return <Redirect href={"/"} />;
  }

  return (
    <View className="flex-1 bg-black h-full">
      <LinearGradient
        colors={["#3500B7", "#1B005E", "#000000"]}
        className="h-full"
        style={{}}
      >
        <View className="flex-1 bg-white/20 h-full">
          <Appbar.Header
            elevated={false}
            statusBarHeight={48}
            className="bg-transparent text-white"
          >
            <Appbar.Action
              icon={() => <X size={24} color="#FFF" />}
              onPress={() => {
                router.back();
              }}
              color="#fff"
              size={24}
            />
            <Appbar.Content
              title=""
              color="#fff"
              titleStyle={{ fontWeight: "bold" }}
            />
          </Appbar.Header>
          <View className="flex-1 flex-col px-4 bg-transparent space-y-4">
            <View className="flex flex-col justify-start mt-4">
              <Text className="text-left text-white text-lg font-bold">
                Accounts
              </Text>
            </View>
            <View className="bg-white/20 w-full mx-auto rounded-2xl p-2 flex flex-col space-y-2">
              <Pressable
                onPress={() => {
                  setSelectedChain(base);
                  setChain(base);
                }}
                className={`flex flex-row items-center justify-between p-4 rounded-lg ${selectedChain === base ? "bg-white/25" : ""}`}
              >
                <View className="flex flex-row space-x-4">
                  <Image
                    className="h-8 w-8 rounded-full"
                    source={require("../../images/base.png")}
                  />
                  <Text className="text-white text-lg font-semibold">Base</Text>
                </View>
                <Text className="text-white text-lg font-semibold">
                  ${formatBigInt(baseBalance!, 2)}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setSelectedChain(sepolia);
                  setChain(sepolia);
                }}
                className={`flex flex-row items-center justify-between p-4 rounded-lg ${selectedChain === sepolia ? "bg-white/25" : ""}`}
              >
                <View className="flex flex-row space-x-4">
                  <Image
                    className="h-8 w-8 rounded-full"
                    source={require("../../images/sepolia.png")}
                  />

                  <Text className="text-white text-lg font-semibold">
                    Sepolia
                  </Text>
                </View>
                <Text className="text-white text-lg font-semibold">
                  ${formatBigInt(sepoliaBalance!, 2)}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
