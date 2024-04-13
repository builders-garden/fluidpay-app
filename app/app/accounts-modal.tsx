import { View, Text, Image, Pressable } from "react-native";
import { Appbar } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useChainStore } from "../../store/use-chain-store";
import { Chain, base, sepolia } from "viem/chains";
import { formatBigInt } from "../../lib/utils";
import { useSwitchChain } from "wagmi";
import { router } from "expo-router";
import {
  useGetUserSmartAccounts,
  useGetSmartAccountBalance,
} from "@sefu/react-sdk";

export default function AccountsModal() {
  const chain = useChainStore((state) => state.chain);
  const setChain = useChainStore((state) => state.setChain);
  const [selectedChain, setSelectedChain] = useState(chain);
  const { switchChain } = useSwitchChain();

  const { smartAccountList, error } = useGetUserSmartAccounts();
  const {
    data: fkeyBaseBalance,
    refetch: refetchBaseFkeyBalance,
  } = useGetSmartAccountBalance({
    idSmartAccount: smartAccountList ? smartAccountList[0].idSmartAccount : "",
    chainId: base.id,
  });

  const {
    data: fkeySepoliaBalance,
    refetch: refetchSepoliaFkeyBalance,
  } = useGetSmartAccountBalance({
    idSmartAccount: smartAccountList ? smartAccountList[0].idSmartAccount : "",
    chainId: sepolia.id,
  });


  useEffect(() => {
    console.log("Refetching balance", smartAccountList);
    refetchBaseFkeyBalance();
    refetchSepoliaFkeyBalance();
  }, []);

  const sepoliaBalance = fkeySepoliaBalance.find(
    (b) => b.token.symbol === "USDC"
  )
    ? formatBigInt(
        BigInt(fkeySepoliaBalance.find((b) => b.token.symbol === "USDC")!.amount),
        2
      )
    : "0.00";

  const baseBalance = fkeyBaseBalance.find((b) => b.token.symbol === "USDC")
    ? formatBigInt(
        BigInt(
          fkeyBaseBalance.find(
            (b) => b.token.symbol === "USDC"
          )!.amount
        ),
        2
      )
    : "0.00";

  const switchSelectedChain = async (newChain: Chain) => {
    switchChain({
      chainId: newChain.id,
    });
    setChain(newChain);
    setSelectedChain(newChain);
  };

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
                  ${baseBalance}
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
                  ${sepoliaBalance}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
