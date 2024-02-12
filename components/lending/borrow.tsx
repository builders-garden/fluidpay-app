import {
  SmartContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react-native";
import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { useUserStore } from "../../store/use-user-store";
import { AmountChooser } from "../amount-chooser";
import { View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { formatUnits } from "viem";
import AppButton from "../app-button";
import { GHO_ASSET_PRICE, GHO_SEPOLIA_ADDRESS } from "../../constants/sepolia";

export default function LendingBorrow({
  balanceOfLoading,
  refetchBalance,
  refetchPoolBalance,
  aavePoolContract,
  ghoContract,
}: {
  balanceOfLoading: boolean;
  refetchBalance: () => void;
  refetchPoolBalance: () => void;
  aavePoolContract: SmartContract<ethers.BaseContract> | undefined;
  ghoContract: SmartContract<ethers.BaseContract> | undefined;
}) {
  const user = useUserStore((state) => state.user);
  const [borrowAmount, setBorrowAmount] = useState(0);
  const { mutateAsync: borrow, isLoading: isBorrowing } = useContractWrite(
    aavePoolContract,
    "borrow"
  );
  const { mutateAsync: approve, isLoading: isApproving } = useContractWrite(
    ghoContract,
    "approve"
  );
  const {
    data: userData = [BigNumber.from(0), BigNumber.from(0), BigNumber.from(0)],
    isLoading,
  } = useContractRead(
    aavePoolContract,
    "getUserAccountData",
    [user?.address]
    // ["0x0e07Ed3049FD6408AEB26049e76609e0491b3A49"]
  );

  const canBorrow =
    userData && userData[2]
      ? parseFloat(userData[2].div(GHO_ASSET_PRICE).toString()) > 0
      : false;

  const executeBorrow = async () => {
    try {
      const borrowAmountInWei = BigNumber.from(borrowAmount).mul(
        BigNumber.from(10).pow(18)
      );

      const { receipt } = await borrow({
        args: [GHO_SEPOLIA_ADDRESS, borrowAmountInWei, 2, 0, user?.address],
      });

      if (receipt) {
        setBorrowAmount(0);
      }
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Borrowed GHO successfully.",
      });
      refetchBalance();
      refetchPoolBalance();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "Error borrowing GHO. Try again.",
      });
    }
  };
  return (
    <View className="flex flex-col">
      <Text className="text-white mt-4">
        This is amount of GHO that you want to borrow.
      </Text>
      <View className="mx-auto">
        <AmountChooser
          dollars={borrowAmount}
          onSetDollars={setBorrowAmount}
          showAmountAvailable
          autoFocus
          lagAutoFocus={false}
        />
      </View>
      {balanceOfLoading ? (
        <ActivityIndicator animating={true} color={"#C9B3F9"} />
      ) : (
        <>
          <Text className="text-[#53516C] font-semibold text-center">
            ${parseFloat(formatUnits(userData[2], 8)).toFixed(2)} borrowable
          </Text>
          {/* 
          <Text className="text-[#53516C] font-semibold">
            ${formatUnits(userData[1], 8)} borrowed
          </Text> */}
        </>
      )}
      <View className="mt-8 w-full">
        {isBorrowing || isApproving ? (
          <ActivityIndicator animating={true} color={"#C9B3F9"} />
        ) : (
          <AppButton
            text="Borrow"
            onPress={() => executeBorrow()}
            variant={canBorrow ? "primary" : "disabled"}
          />
        )}
      </View>
    </View>
  );
}
