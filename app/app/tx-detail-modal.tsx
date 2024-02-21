import { Link, router } from "expo-router";
import { Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../store";
import Avatar from "../../components/avatar";
import TimeAgo from "@andordavoti/react-native-timeago";
import { ArrowLeft, Share } from "lucide-react-native";

export default function TransactionDetailModal() {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);

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
          icon={() => <ArrowLeft size={24} color="#FFF" />}
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
        <Appbar.Action
          icon={() => <Share size={24} color="#FFF" />}
          onPress={() => {
            router.back();
          }}
          color="#fff"
          size={24}
        />
      </Appbar.Header>
      <View className="flex px-4 h-full space-y-8 mt-6">
        <View className="flex">
          <View className="flex flex-row items-center justify-between space-x-2">
            <Text className="text-3xl text-white font-bold">-$18,46</Text>
            <Avatar name="F" />
          </View>
          <View className="flex">
            <Text className="text-[#0061FF] text-lg font-semibold">
              frankc - @frankcc
            </Text>
            <Text className="text-[#8F8F91]">
              <TimeAgo dateTo={new Date()} />
            </Text>
          </View>
        </View>

        <View className="bg-[#161618] w-full mx-auto rounded-lg p-4 space-y-4">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-gray-400 text-lg font-medium">Status</Text>

            <Text className="text-green-500 text-lg font-medium">Success</Text>
          </View>
          <View className="flex flex-row items-center justify-between">
            <Text className="text-gray-400 text-lg font-medium">
              Block explorer
            </Text>

            <Text className="text-[#0061FF] text-lg font-medium">View</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
