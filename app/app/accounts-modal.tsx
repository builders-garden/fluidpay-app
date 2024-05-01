import { View, Text, Image, ImageBackground, Pressable } from "react-native";
import { Appbar } from "react-native-paper";
import {
  useERC20BalanceOf,
  usePrivyWagmiProvider,
} from "@buildersgarden/privy-wagmi-provider";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react-native";

import { useChainStore } from "../../store/use-chain-store";
import { Chain, base, sepolia } from "viem/chains";
import tokens from "../../constants/tokens";
import { formatBigInt } from "../../lib/utils";
import { useEmbeddedWallet } from "@privy-io/expo";
import { useSwitchChain } from "wagmi";
import { router } from "expo-router";
import { useUserStore } from "../../store";

export default function AccountsModal() {
  const { isConnected, isReady, address } = usePrivyWagmiProvider();
  const chain = useChainStore((state) => state.chain);
  const setChain = useChainStore((state) => state.setChain);
  const user = useUserStore((state) => state.user);
  const [selectedChain, setSelectedChain] = useState(chain);
  const wallet = useEmbeddedWallet();
  const { switchChain } = useSwitchChain();

  const { balance: sepoliaBalance, isLoading: isLoadingSepoliaBalance } =
    useERC20BalanceOf({
      network: sepolia.id,
      args: [user!.smartAccountAddress],
      address: tokens.USDC[sepolia.id] as `0x${string}`,
    });

  const { balance: baseBalance, isLoading: isLoadingBaseBalance } =
    useERC20BalanceOf({
      network: base.id,
      args: [user!.smartAccountAddress],
      address: tokens.USDC[base.id] as `0x${string}`,
    });

  const switchSelectedChain = async (newChain: Chain) => {
    switchChain({
      chainId: newChain.id,
    });
    setChain(newChain);
    setSelectedChain(newChain);
  };

  return (
    <View className="flex-1 bg-black h-full">
      <ImageBackground
        source={require("../../images/blur-bg.png")}
        className="flex-1"
      >
        <View className="flex-1 h-full">
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
                onPress={async () => {
                  await switchSelectedChain(base);
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
                onPress={async () => {
                  await switchSelectedChain(sepolia);
                }}
                className={`flex flex-row items-center justify-between p-4 rounded-lg ${selectedChain === sepolia ? "bg-white/25" : ""}`}
              >
                <View className="flex flex-row space-x-4">
                  <Image
                    className="h-8 w-8 rounded-full"
                    source={require("../../images/sepolia.png")}
                  />

                  <Text className="text-white text-lg font-semibold">
                    Sepolia (Testnet)
                  </Text>
                </View>
                <Text className="text-white text-lg font-semibold">
                  ${formatBigInt(sepoliaBalance!, 2)}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
