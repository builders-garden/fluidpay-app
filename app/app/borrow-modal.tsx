import { View } from "react-native";
import { Link, router } from "expo-router";
import { ActivityIndicator, Appbar } from "react-native-paper";
import { Text } from "react-native";
import { useUserStore } from "../../store";
import {
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react-native";
import {
  AAVE_BORROW_ADDRESS,
  GHO_ASSET_PRICE,
  GHO_SEPOLIA_ADDRESS,
} from "../../constants/sepolia";
import AppButton from "../../components/app-button";
import { doc, setDoc } from "firebase/firestore";
import { firebaseFirestore } from "../../firebaseConfig";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";

export default function BorrowModal() {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);
  const { contract } = useContract(AAVE_BORROW_ADDRESS);
  const { data: userData, isLoading } = useContractRead(
    contract,
    "getUserAccountData",
    [user?.address]
    // ["0x0e07Ed3049FD6408AEB26049e76609e0491b3A49"]
  );
  const { mutateAsync: repay, isLoading: repayLoading } = useContractWrite(
    contract,
    "repay"
  );
  const { mutateAsync: borrow, isLoading: borrowLoading } = useContractWrite(
    contract,
    "borrow"
  );
  const canBorrow =
    userData && userData[2]
      ? parseFloat(userData[2].div(GHO_ASSET_PRICE).toString()) > 0
      : false;

  const canRepay =
    userData && userData[1] ? parseFloat(userData[1].toString()) > 0 : false;

  // const progress = useSharedValue(0);
  // const min = useSharedValue(0);
  // const max = useSharedValue(
  //   userData && userData[4] ? parseFloat(formatUnits(userData[4], 4)) : 0
  // );

  const executeBorrow = async () => {
    try {
      const { receipt } = await borrow({
        args: [GHO_SEPOLIA_ADDRESS, userData[2], 2, 0, user?.address],
      });

      const transaction = {
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        from: user?.address,
        action: "Borrow",
        amount: userData[2].div(GHO_ASSET_PRICE).toString(),
        createdAt: new Date().toISOString(),
      };
      await setDoc(
        doc(firebaseFirestore, "pockets", receipt.transactionHash),
        transaction
      );
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Borrowed GHO successfully.",
      });

      router.back();
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "Error borrowing GHO. Try again.",
      });
    }
  };

  const executeRepay = async () => {
    try {
      const { receipt } = await repay({
        args: [GHO_SEPOLIA_ADDRESS, userData[1], 2, user?.address],
      });

      const transaction = {
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        from: user?.address,
        action: "Repay",
        amount: userData[1].div(GHO_ASSET_PRICE).toString(),
        createdAt: new Date().toISOString(),
      };

      await setDoc(
        doc(firebaseFirestore, "pockets", receipt.transactionHash),
        transaction
      );
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Repayed GHO successfully.",
      });
      router.back();
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "Error repaying GHO. Try again.",
      });
    }
  };

  return (
    <View className="flex-1 flex-col px-4 bg-[#201F2D]">
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header
        elevated={false}
        statusBarHeight={0}
        className="bg-[#201F2D] text-white"
      >
        <Appbar.Content
          title="Borrow GHO"
          color="#fff"
          titleStyle={{ fontWeight: "bold" }}
        />
        <Appbar.Action
          icon={() => <Icon name="close" size={24} color="#FFF" />}
          onPress={() => router.back()}
          color="#fff"
          size={20}
        />
      </Appbar.Header>
      <Text className="text-white font-semibold mt-2 text-lg">
        Here you can borrow GHO using the collateral that was automatically
        deposited by GHOst.
      </Text>
      {isLoading || !userData ? (
        <View className="mt-4">
          <ActivityIndicator animating={true} color={"#C9B3F9"} />
        </View>
      ) : (
        <View>
          {/* <Text className="text-[#53516C] font-semibold mt-8">
            Total collateral base (USD)
          </Text>
          <Text className="text-white font-semibold mt-2">
            $
            {userData[0]
              ? parseFloat(userData[0].div(GHO_ASSET_PRICE).toString()).toFixed(
                  2
                )
              : "0.00"}
          </Text> */}
          <Text className="text-[#53516C] font-semibold mt-4">
            Borrowable GHO
          </Text>
          <Text className="text-white font-semibold mt-1 text-lg">
            {userData[2]
              ? parseFloat(userData[2].div(GHO_ASSET_PRICE).toString()).toFixed(
                  2
                )
              : "0.00"}{" "}
            GHO
          </Text>
          {/* <Text className="text-[#53516C] font-semibold mt-4">
            Maximum LTV (loan-to-value)
          </Text>
          <Text className="text-white font-semibold mt-2">
            {formatUnits(userData[4], 4)}
          </Text>
          <Text className="text-[#53516C] font-semibold mt-4">
            Health Factor
          </Text>
          <Text className="text-white font-semibold mt-2">
            {parseFloat(formatUnits(userData[5], 18)).toFixed(2)}%
          </Text> */}
          {/* <Slider progress={progress} minimumValue={min} maximumValue={max} /> */}
          <View className="mt-4">
            {borrowLoading ? (
              <ActivityIndicator animating={true} color={"#C9B3F9"} />
            ) : (
              <AppButton
                text={
                  canBorrow
                    ? `Borrow ${parseFloat(
                        userData[2].div(GHO_ASSET_PRICE).toString()
                      ).toFixed(2)} GHO`
                    : "Not enough collateral"
                }
                variant={canBorrow ? "primary" : "disabled"}
                onPress={() => executeBorrow()}
              />
            )}
          </View>
          <Text className="text-[#53516C] font-semibold mt-4">
            Amount borrowed
          </Text>
          <Text className="text-white font-semibold mt-1 text-lg">
            {userData[1]
              ? parseFloat(userData[1].div(GHO_ASSET_PRICE).toString()).toFixed(
                  2
                )
              : "0.00"}{" "}
            GHO
          </Text>
          <View className="mt-4">
            {repayLoading ? (
              <ActivityIndicator animating={true} color={"#C9B3F9"} />
            ) : (
              <AppButton
                text={
                  canRepay
                    ? `Repay ${parseFloat(
                        userData[1].div(GHO_ASSET_PRICE).toString()
                      ).toFixed(2)} GHO`
                    : "Not enough debt"
                }
                variant={canRepay ? "primary" : "disabled"}
                onPress={() => executeRepay()}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
}
