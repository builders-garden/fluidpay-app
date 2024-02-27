import { Link, router } from "expo-router";
import { Image, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../store";
import {
  shortenAddress,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react-native";
import { ArrowLeft, Copy } from "lucide-react-native";
import { BigNumber } from "ethers";
import { USDC_ADDRESS } from "../../constants/sepolia";

export default function DetailsModal() {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);

  const { contract } = useContract(USDC_ADDRESS);
  const { data: balanceData = BigNumber.from(0) } = useContractRead(
    contract,
    "balanceOf",
    [user?.address]
  );

  return (
    <SafeAreaView
      className="flex-1 flex-col bg-[#161618]"
      edges={{ top: "off" }}
    >
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header
        elevated={false}
        statusBarHeight={0}
        className="bg-[#161618] text-white"
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
            <Text className="text-3xl text-white font-bold">
              $
              {balanceData
                .div(10 ** 6)
                .toNumber()
                .toFixed(2)}
            </Text>
            <Text className="text-white text-lg font-semibold">
              Optimism • USDC
            </Text>
          </View>

          <Image
            className="h-16 w-16"
            source={require("../../images/usdc.png")}
          />
        </View>
        <View className="bg-[#232324] w-full mx-auto rounded-xl p-4 space-y-4">
          <View className="flex flex-row items-center justify-between">
            <View className="flex space-y-2">
              <Text className="text-gray-400 text-lg font-medium">
                Beneficiary
              </Text>
              <Text className="text-[#0061FF] text-lg font-medium">
                {user?.username}
              </Text>
            </View>

            <Copy size={20} color="#0061FF" />
          </View>
          <View className="flex flex-row items-center justify-between">
            <View className="flex space-y-2">
              <Text className="text-gray-400 text-lg font-medium">Address</Text>
              <Text className="text-[#0061FF] text-lg font-medium">
                {shortenAddress(user?.address)}
              </Text>
            </View>

            <Copy size={20} color="#0061FF" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
