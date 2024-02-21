import { Link, router } from "expo-router";
import { Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import Avatar from "../../components/avatar";
import { useUserStore } from "../../store";
import AppButton from "../../components/app-button";
import { ArrowLeft, Copy } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RequestModal() {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);

  if (!user) {
    return <View className="flex-1 bg-black" />;
  }

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
          size={20}
        />
        <Appbar.Content
          title={""}
          color="#fff"
          titleStyle={{ fontWeight: "bold" }}
        />
      </Appbar.Header>
      <View className="flex px-4 space-y-4 h-full">
        <Text className="text-3xl text-white font-bold">Request via link</Text>
        <View className="flex items-center space-y-2 mt-4">
          <Avatar name={user?.username.charAt(0)} size={64} />
          <Text className="text-white font-semibold text-lg">
            {user?.username}
          </Text>
          <Text className="text-gray-400 text-lg">
            Share your link so anyone can pay you
          </Text>
          <View className="flex flex-row items-center space-x-2">
            <Copy size={20} color="#0061FF" />
            <Text className="text-[#0061FF] font-bold text-lg">
              crumina.xyz/{user?.username}
            </Text>
          </View>
        </View>
        <View className="flex flex-grow" />
        <SafeAreaView className="flex flex-col mb-24">
          <View className="mb-4">
            <AppButton text="Share link" variant="primary" onPress={() => {}} />
          </View>
          <AppButton
            text="Request a specific amount"
            variant="ghost"
            onPress={() => {}}
          />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}
