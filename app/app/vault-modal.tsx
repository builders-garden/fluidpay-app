import { Link, router } from "expo-router";
import { View, Text } from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContract, useContractRead } from "@thirdweb-dev/react-native";
import { useUserStore } from "../../store";
import {
  GHO_SEPOLIA_ADDRESS,
  VAULT_ABI,
  VAULT_ADDRESS,
} from "../../constants/sepolia";
import { BigNumber } from "ethers";
import { useRef, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { formatUnits } from "viem";
import { SegmentSlider } from "../../components/segment-slider";
import VaultDeposit from "../../components/vault/deposit";
import VaultWithdraw from "../../components/vault/withdraw";
import Spacer from "../../components/spacer";

type VaultScreenOptions = "DEPOSIT" | "WITHDRAW";

export default function VaultModal({
  option,
}: {
  option?: VaultScreenOptions;
}) {
  const user = useUserStore((state) => state.user);
  const { contract: ghoContract } = useContract(GHO_SEPOLIA_ADDRESS);
  const {
    data: balanceData = BigNumber.from(0),
    isLoading: balanceOfLoading,
    refetch: refetchBalance,
  } = useContractRead(ghoContract, "balanceOf", [user?.address]);
  const balance = (balanceData / 10 ** 18).toFixed(2);
  const { contract: vaultContract } = useContract(VAULT_ADDRESS, VAULT_ABI);

  const [tab, setTab] = useState<VaultScreenOptions>(option || "DEPOSIT");
  const tabs = useRef(["DEPOSIT", "WITHDRAW"] as VaultScreenOptions[]).current;

  const { data: totalShares = BigNumber.from(0) } = useContractRead(
    vaultContract,
    "totalAssets"
  );
  const readableTotalShares = parseFloat(
    formatUnits(totalShares.toString(), 18)
  );
  const {
    data: userBalance = BigNumber.from(0),
    refetch: refetchVaultBalance,
  } = useContractRead(vaultContract, "totalAssetsOfUser", [user?.address]);
  const readableUserBalance = parseFloat(
    formatUnits(userBalance.toString(), 18)
  );

  const isPresented = router.canGoBack();
  return (
    <SafeAreaView
      className="flex-1 flex-col bg-[#201F2D]"
      edges={{ top: "off" }}
    >
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header
        elevated={false}
        statusBarHeight={0}
        className="bg-[#201F2D] text-white"
      >
        <Appbar.Content
          title="GHO Vault"
          color="#fff"
          titleStyle={{ fontWeight: "bold" }}
        />
        <Appbar.Action
          icon={() => <Icon name="close" size={24} color="#FFF" />}
          onPress={() => {
            router.back();
          }}
          color="#fff"
          size={20}
        />
      </Appbar.Header>
      <View className="flex flex-col px-4 mt-2 bg-[#201F2D]">
        <View className="px-14 pb-8">
          <Text className="text-white font-semibold text-center mb-4">
            Your Vault balance
          </Text>
          <Text className="text-white font-bold text-center text-5xl">
            ${readableUserBalance.toFixed(2)}
          </Text>
        </View>
        <View className="flex flex-row items-center justify-around space-x-4">
          <View className="flex flex-col space-y-1 items-center w-48">
            <Text className="text-[#53516C] font-semibold">Balance</Text>
            <Text className="text-white text-2xl font-bold text-center">
              ${balance}
            </Text>
          </View>
          <View className="flex flex-col space-y-1 items-center text-center w-48">
            <Text className="text-[#53516C] font-semibold text-center">
              Vault Balance
            </Text>
            <Text className="text-white text-2xl font-bold text-center">
              ${readableTotalShares.toFixed(2)}
            </Text>
          </View>
          <View className="flex flex-col space-y-1 items-center w-48">
            <Text className="text-[#53516C] font-semibold">APY</Text>
            <Text className="text-white text-2xl font-bold text-center">
              3.00%
            </Text>
          </View>
        </View>
        <Spacer h={24} />
        <SegmentSlider {...{ tabs, tab, setTab }} />
        {tab === "DEPOSIT" && (
          <VaultDeposit
            balanceData={balanceData}
            balanceOfLoading={balanceOfLoading}
            refetchBalance={refetchBalance}
            refetchVaultBalance={refetchVaultBalance}
            ghoContract={ghoContract}
            vaultContract={vaultContract}
          />
        )}
        {tab === "WITHDRAW" && (
          <VaultWithdraw
            balanceData={balanceData}
            balanceOfLoading={balanceOfLoading}
            refetchBalance={refetchBalance}
            refetchVaultBalance={refetchVaultBalance}
            ghoContract={ghoContract}
            vaultContract={vaultContract}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
