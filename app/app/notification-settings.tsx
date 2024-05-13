import { Text, View } from "react-native";
import { router } from "expo-router";
import { Appbar, Switch } from "react-native-paper";
import { ArrowLeft, Users2, Banknote, Receipt } from "lucide-react-native";
import { useColorScheme } from "nativewind";

export default function NotificationSettings() {
  const { colorScheme } = useColorScheme();
  return (
    <View className="flex-1 flex-col bg-absoluteWhite dark:bg-black">
      <Appbar.Header
        elevated={false}
        statusBarHeight={48}
        className="bg-absoluteWhite dark:bg-black text-darkGrey dark:text-white"
      >
        <Appbar.Action
          icon={() => (
            <ArrowLeft
              size={20}
              color={colorScheme === "dark" ? "#FFF" : "#161618"}
            />
          )}
          onPress={() => {
            router.back();
          }}
          color={colorScheme === "dark" ? "#FFF" : "#161618"}
          size={20}
          animated={false}
        />
        <Appbar.Content
          title={""}
          color={colorScheme === "dark" ? "#FFF" : "#161618"}
          titleStyle={{ fontWeight: "bold" }}
        />
      </Appbar.Header>
      <View className="flex px-4 space-y-4">
        <Text className="text-3xl text-darkGrey dark:text-white font-bold">
          Notifications settings
        </Text>
        <View className="bg-white dark:bg-darkGrey w-full mx-auto rounded-2xl mt-8 p-4 flex flex-col space-y-6">
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center space-x-4">
              <Receipt size={24} color="#3F89FF" />
              <View className="flex flex-col">
                <Text className="text-darkGrey dark:text-white font-semibold">
                  Payment requests
                </Text>
              </View>
            </View>
            <Switch value={false} />
          </View>
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center space-x-4">
              <Users2 size={24} color="#3F89FF" />
              <View className="flex flex-col">
                <Text className="text-darkGrey dark:text-white font-semibold">
                  Group invites
                </Text>
              </View>
            </View>
            <Switch value={false} />
          </View>
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center space-x-4">
              <Banknote size={24} color="#3F89FF" />
              <View className="flex flex-col">
                <Text className="text-darkGrey dark:text-white font-semibold">
                  New expense in group
                </Text>
              </View>
            </View>
            <Switch value={false} />
          </View>
        </View>
      </View>
    </View>
  );
}
