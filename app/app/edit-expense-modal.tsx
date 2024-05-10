import { Link, router } from "expo-router";
import { Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../store";
import Avatar from "../../components/avatar";
import TimeAgo from "@andordavoti/react-native-timeago";
import { ArrowLeft, Share } from "lucide-react-native";
import { useColorScheme } from "nativewind";

export default function EditExpenseModal() {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);

  const { colorScheme } = useColorScheme();

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
        <Appbar.Action
          icon={() => (
            <Share
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
      </Appbar.Header>
      <View className="flex px-4 h-full space-y-8 mt-6">
        <View className="flex">
          <View className="flex flex-row items-center justify-between space-x-2">
            <Text className="text-3xl text-darkGrey dark:text-white font-bold">
              -$18,46
            </Text>
            <Avatar name="F" />
          </View>
          <View className="flex">
            <Text className="text-[#FF238C] text-lg font-semibold">
              frankc - @frankcc
            </Text>
            <Text className="text-mutedGrey">
              <TimeAgo dateTo={new Date()} />
            </Text>
          </View>
        </View>

        <View className="bg-darkGrey w-full mx-auto rounded-lg p-4 space-y-4">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-gray-400 text-lg font-medium">Status</Text>

            <Text className="text-green-500 text-lg font-medium">Success</Text>
          </View>
          <View className="flex flex-row items-center justify-between">
            <Text className="text-gray-400 text-lg font-medium">
              Block explorer
            </Text>

            <Text className="text-[#FF238C] text-lg font-medium">View</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
