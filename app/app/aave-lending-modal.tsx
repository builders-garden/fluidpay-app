import { Link, router } from "expo-router";
import { View, Text } from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContract, useContractRead } from "@thirdweb-dev/react-native";
import { useUserStore } from "../../store";
import {
  AAVE_POOL_ADDRESS,
  GHO_SEPOLIA_ADDRESS,
} from "../../constants/sepolia";
import { BigNumber } from "ethers";
import { useRef, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { formatUnits } from "viem";
import { SegmentSlider } from "../../components/segment-slider";
import Spacer from "../../components/spacer";
import LendingBorrow from "../../components/lending/borrow";
import LendingWithdraw from "../../components/lending/withdraw";
import LendingSupply from "../../components/lending/supply";

type AAVELendingScreenOptions = "SUPPLY" | "WITHDRAW" | "BORROW";

export default function AAVELendingModal({
  option,
}: {
  option?: AAVELendingScreenOptions;
}) {
  const user = useUserStore((state) => state.user);
  const { contract: ghoContract } = useContract(GHO_SEPOLIA_ADDRESS);
  const {
    data: balanceData = BigNumber.from(0),
    isLoading: balanceOfLoading,
    refetch: refetchBalance,
  } = useContractRead(ghoContract, "balanceOf", [user?.address]);
  const balance = (balanceData / 10 ** 18).toFixed(2);
  const { contract: aavePoolContract } = useContract(AAVE_POOL_ADDRESS);

  const [tab, setTab] = useState<AAVELendingScreenOptions>(option || "BORROW");
  const tabs = useRef([
    "BORROW",
    "SUPPLY",
    "WITHDRAW",
  ] as AAVELendingScreenOptions[]).current;

  const {
    data: userData = [BigNumber.from(0), BigNumber.from(0), BigNumber.from(0)],
    isLoading,
    refetch: refetchPoolBalance,
  } = useContractRead(
    aavePoolContract,
    "getUserAccountData",
    [user?.address]
    // ["0x0e07Ed3049FD6408AEB26049e76609e0491b3A49"]
  );
  const readableUserBalance = parseFloat(
    formatUnits(userData[0].toString(), 8)
  );
  const readableUserBorrowBalance = parseFloat(
    formatUnits(userData[1].toString(), 8)
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
          title="AAVE Lending"
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
            Your AAVE Pool balance
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
          <View className="flex flex-col space-y-1 items-center w-48">
            <Text className="text-[#53516C] font-semibold">Borrowed</Text>
            <Text className="text-white text-2xl font-bold text-center">
              ${readableUserBorrowBalance.toFixed(2)}
            </Text>
          </View>
          <View className="flex flex-col space-y-1 items-center w-48">
            <Text className="text-[#53516C] font-semibold">APY</Text>
            <Text className="text-white text-2xl font-bold text-center">
              1.50%
            </Text>
          </View>
        </View>
        <Spacer h={24} />
        <SegmentSlider {...{ tabs, tab, setTab }} />
        {tab === "BORROW" && (
          <LendingBorrow
            balanceOfLoading={balanceOfLoading}
            refetchBalance={refetchBalance}
            refetchPoolBalance={refetchPoolBalance}
            ghoContract={ghoContract}
            aavePoolContract={aavePoolContract}
          />
        )}
        {tab === "SUPPLY" && (
          <LendingSupply
            balanceData={balanceData}
            balanceOfLoading={balanceOfLoading}
            refetchBalance={refetchBalance}
            refetchPoolBalance={refetchPoolBalance}
            ghoContract={ghoContract}
            aavePoolContract={aavePoolContract}
          />
        )}
        {tab === "WITHDRAW" && (
          <LendingWithdraw
            balanceData={balanceData}
            balanceOfLoading={balanceOfLoading}
            refetchBalance={refetchBalance}
            refetchPoolBalance={refetchPoolBalance}
            ghoContract={ghoContract}
            aavePoolContract={aavePoolContract}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
