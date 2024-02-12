import {
  SmartContract,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react-native";
import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import {
  AAVE_POOL_ADDRESS,
  DAI_ADDRESS,
  GHO_SEPOLIA_ADDRESS,
  SUPPLY_ROUTER_ADDRESS,
} from "../../constants/sepolia";
import Toast from "react-native-toast-message";
import { useUserStore } from "../../store/use-user-store";
import { AmountChooser } from "../amount-chooser";
import { View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { formatUnits } from "viem";
import AppButton from "../app-button";

export default function LendingSupply({
  balanceData,
  balanceOfLoading,
  refetchBalance,
  refetchPoolBalance,
  aavePoolContract,
  ghoContract,
}: {
  balanceData: BigNumber;
  balanceOfLoading: boolean;
  refetchBalance: () => void;
  refetchPoolBalance: () => void;
  aavePoolContract: SmartContract<ethers.BaseContract> | undefined;
  ghoContract: SmartContract<ethers.BaseContract> | undefined;
}) {
  const user = useUserStore((state) => state.user);
  const [supplyAmount, setSupplyAmount] = useState(0);
  const { mutateAsync: supply, isLoading: isSupplying } = useContractWrite(
    aavePoolContract,
    "deposit"
  );
  const { mutateAsync: ghoApprove, isLoading: isApprovingGHO } =
    useContractWrite(ghoContract, "approve");
  const { contract: daiContract } = useContract(DAI_ADDRESS);
  const { data: daiBalanceData } = useContractRead(daiContract, "balanceOf", [
    user?.address,
  ]);
  const { mutateAsync: approve, isLoading: isApproving } = useContractWrite(
    daiContract,
    "approve"
  );
  const { data: approvalData } = useContractRead(daiContract, "allowance", [
    user?.address,
    AAVE_POOL_ADDRESS,
  ]);
  const { data: ghoApprovalData } = useContractRead(ghoContract, "allowance", [
    user?.address,
    SUPPLY_ROUTER_ADDRESS,
  ]);
  const { contract: supplyRouterContract } = useContract(SUPPLY_ROUTER_ADDRESS);
  const { mutateAsync: swap, isLoading: isSwapping } = useContractWrite(
    supplyRouterContract,
    "swapExactTokensForTokens"
  );

  const balance = parseFloat(
    formatUnits(balanceData.toString() as any, 18)
  ).toFixed(2);

  const canSupply =
    supplyAmount && supplyAmount > 0 && parseFloat(balance) >= supplyAmount;
  const executeSupply = async () => {
    try {
      const supplyAmountInWei = BigNumber.from(supplyAmount).mul(
        BigNumber.from(10).pow(18)
      );

      if (ghoApprovalData.eq(0)) {
        console.log("approving GHO spending to router");
        const { receipt } = await ghoApprove({
          args: [SUPPLY_ROUTER_ADDRESS, ethers.constants.MaxUint256],
        });
      }

      if (approvalData.eq(0)) {
        console.log("approving spending");
        const { receipt } = await approve({
          args: [AAVE_POOL_ADDRESS, ethers.constants.MaxUint256],
        });
      }

      if (daiBalanceData.lt(supplyAmountInWei)) {
        const { receipt: swapReceipt } = await swap({
          args: [
            supplyAmountInWei.sub(daiBalanceData),
            supplyAmountInWei.sub(daiBalanceData),
            [GHO_SEPOLIA_ADDRESS, DAI_ADDRESS],
            user?.address,
            0,
          ],
          overrides: { maxFeePerGas: 4 },
        });
      }

      const { receipt } = await supply({
        args: [DAI_ADDRESS, supplyAmountInWei, user?.address, 0],
        overrides: { maxFeePerGas: 4 },
      });

      if (receipt) {
        setSupplyAmount(0);
      }
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Supplied GHO successfully.",
      });
      refetchBalance();
      refetchPoolBalance();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "Error supplying GHO. Try again.",
      });
    }
  };
  return (
    <View className="flex flex-col">
      <Text className="text-white mt-4">
        This is the amount of GHO that you want to supply to the pool. It will
        be converted into DAI.
      </Text>
      <View className="mx-auto">
        <AmountChooser
          dollars={supplyAmount}
          onSetDollars={setSupplyAmount}
          showAmountAvailable
          autoFocus
          lagAutoFocus={false}
        />
      </View>
      {balanceOfLoading ? (
        <ActivityIndicator animating={true} color={"#C9B3F9"} />
      ) : (
        <Text className="text-[#53516C] font-semibold text-center">
          ${balance} available
        </Text>
      )}
      <View className="mt-8 w-full">
        {isSupplying || isApproving || isApprovingGHO || isSwapping ? (
          <ActivityIndicator animating={true} color={"#C9B3F9"} />
        ) : (
          <AppButton
            text="Supply"
            onPress={() => executeSupply()}
            variant={canSupply ? "primary" : "disabled"}
          />
        )}
      </View>
    </View>
  );
}
