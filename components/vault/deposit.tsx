import {
  SmartContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react-native";
import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import { VAULT_ADDRESS } from "../../constants/sepolia";
import Toast from "react-native-toast-message";
import { useUserStore } from "../../store/use-user-store";
import { AmountChooser } from "../amount-chooser";
import { View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { formatUnits } from "ethers/lib/utils";
import AppButton from "../app-button";

export default function VaultDeposit({
  balanceData,
  balanceOfLoading,
  refetchBalance,
  refetchVaultBalance,
  vaultContract,
  ghoContract,
}: {
  balanceData: BigNumber;
  balanceOfLoading: boolean;
  refetchBalance: () => void;
  refetchVaultBalance: () => void;
  vaultContract: SmartContract<ethers.BaseContract> | undefined;
  ghoContract: SmartContract<ethers.BaseContract> | undefined;
}) {
  const user = useUserStore((state) => state.user);
  const [depositAmount, setDepositAmount] = useState(0);
  const { mutateAsync: deposit, isLoading: isDepositing } = useContractWrite(
    vaultContract,
    "deposit"
  );
  const { mutateAsync: approve, isLoading: isApproving } = useContractWrite(
    ghoContract,
    "approve"
  );
  const { data: approvalData } = useContractRead(ghoContract, "allowance", [
    user?.address,
    VAULT_ADDRESS,
  ]);
  const balance = parseFloat(
    formatUnits(balanceData.toString() as any, 18)
  ).toFixed(2);
  const canDeposit =
    depositAmount && depositAmount > 0 && parseFloat(balance) >= depositAmount;
  const executeDeposit = async () => {
    try {
      const depositAmountInWei = BigNumber.from(depositAmount).mul(
        BigNumber.from(10).pow(18)
      );

      if (approvalData.eq(0)) {
        console.log("approving spending");
        const { receipt } = await approve({
          args: [VAULT_ADDRESS, ethers.constants.MaxUint256],
        });
      }

      const { receipt } = await deposit({
        args: [depositAmountInWei, user?.address],
      });

      if (receipt) {
        setDepositAmount(0);
      }
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Deposited GHO successfully.",
      });
      refetchBalance();
      refetchVaultBalance();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "Error depositing GHO. Try again.",
      });
    }
  };
  return (
    <View className="flex flex-col">
      <Text className="text-white mt-4">
        This is the amount of GHO that you will deposit in the GHO Vault. The
        actual amount of deposited tokens can be lower than the input one
        because of liquidity provisioning conditions.
      </Text>
      <View className="mx-auto">
        <AmountChooser
          dollars={depositAmount}
          onSetDollars={setDepositAmount}
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
        {isDepositing || isApproving ? (
          <ActivityIndicator animating={true} color={"#C9B3F9"} />
        ) : (
          <AppButton
            text="Deposit"
            onPress={() => executeDeposit()}
            variant={canDeposit ? "primary" : "disabled"}
          />
        )}
      </View>
    </View>
  );
}
