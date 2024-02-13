import { Link, router } from "expo-router";
import { Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import Avatar from "../../components/avatar";
import { useUserStore } from "../../store";
import AppButton from "../../components/app-button";

export default function RequestModal() {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);

  if (!user) {
    return <View className="flex-1 bg-black" />;
  }

  return (
    <SafeAreaView className="flex-1 flex-col bg-black" edges={{ top: "off" }}>
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header
        elevated={false}
        statusBarHeight={0}
        className="bg-black text-white"
      >
        <Appbar.Content
          title="Request via link"
          color="#fff"
          titleStyle={{ fontWeight: "bold" }}
        />
        <Appbar.Action
          icon={() => <Icon name="close" size={24} color="#FFF" />}
          onPress={() => {
            router.back();
          }}
          color="#fff"
          size={20}
        />
      </Appbar.Header>
      <View className="flex h-screen px-4">
        <View className="flex items-center space-y-2">
          <Avatar name={user?.username.charAt(0)} size={16} />
          <Text className="text-white font-semibold text-lg">
            {user?.username}
          </Text>
          <Text className="text-gray-400 text-lg">
            Share your link so anyone can pay you
          </Text>
          <View className="flex flex-row items-center space-x-2">
            <Icon name="copy" size={24} color="#667DFF" />
            <Text className="text-[#667DFF] font-bold text-lg">
              crumina.xyz/{user?.username}
            </Text>
          </View>
        </View>
        <View className="flex flex-col mt-auto mb-48">
          <View className="mb-4">
            <AppButton text="Share link" variant="primary" onPress={() => {}} />
          </View>
          <AppButton
            text="Request a specific amount"
            variant="ghost"
            onPress={() => {}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
