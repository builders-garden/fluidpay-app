import { Link, router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../store";
import Avatar from "../../components/avatar";
import TimeAgo from "@andordavoti/react-native-timeago";
import { ArrowLeft } from "lucide-react-native";
import { base, sepolia } from "viem/chains";
import * as WebBrowser from "expo-web-browser";
import { useColorScheme } from "nativewind";

export default function TransactionDetailModal() {
  const { colorScheme } = useColorScheme();
  const { transaction } = useLocalSearchParams();
  const data = JSON.parse(transaction as string);
  const isPresented = router.canGoBack();

  return (
    <SafeAreaView
      className="flex-1 flex-col bg-absoluteWhite dark:bg-darkGrey"
      edges={{ top: "off" }}
    >
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header
        elevated={false}
        statusBarHeight={0}
        className="bg-absoluteWhite dark:bg-darkGrey text-darkGrey dark:text-white"
      >
        <Appbar.Action
          icon={() => (
            <ArrowLeft
              size={24}
              color={colorScheme === "dark" ? "#FFF" : "#161618"}
            />
          )}
          onPress={() => {
            router.back();
          }}
          color={colorScheme === "dark" ? "#FFF" : "#161618"}
          size={24}
        />
        <Appbar.Content
          title=""
          color={colorScheme === "dark" ? "#FFF" : "#161618"}
          titleStyle={{ fontWeight: "bold" }}
        />
        {/* <Appbar.Action
          icon={() => <Share size={24} color="#FFF" />}
          onPress={() => {
            router.back();
          }}
          color="#fff"
          size={24}
        /> */}
      </Appbar.Header>
      <View className="flex px-4 h-full space-y-8 mt-2">
        <View className="flex">
          <View className="flex flex-row items-center justify-between space-x-2">
            <Text className="text-3xl text-darkGrey dark:text-white font-bold">
              -${data.amount.toFixed(2)}
            </Text>
            <Avatar name={data.payee.displayName.charAt(0).toUpperCase()} />
          </View>
          <View className="flex">
            <Text className="text-[#FF238C] text-base font-semibold">
              {data.payee.displayName} - @{data.payee.username}
            </Text>
            <Text className="text-mutedGrey text-xs">
              <TimeAgo dateTo={new Date(data.createdAt)} />
            </Text>
          </View>
        </View>

        <View className="bg-white dark:bg-[#232324] w-full mx-auto rounded-lg p-4 space-y-4">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-base text-mutedGrey font-medium">Note</Text>

            <Text className="text-darkGrey dark:text-white text-base font-medium">
              {data.description ?? "None"}
            </Text>
          </View>
          <View className="flex flex-row items-center justify-between">
            <Text className="text-base text-mutedGrey font-medium">Status</Text>

            <Text className="text-darkGrey dark:text-white text-base font-medium">
              Success
            </Text>
          </View>
          <View className="flex flex-row items-center justify-between">
            <Text className="text-mutedGrey text-base font-medium">Link</Text>
            <Text
              onPress={async () => {
                await WebBrowser.openBrowserAsync(
                  `${data.chainId === sepolia.id ? sepolia.blockExplorers.default.url : base.blockExplorers.default.url}/tx/${data?.txHash}`
                );
              }}
              className="text-base font-medium text-[#FF238C]"
            >
              View
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
