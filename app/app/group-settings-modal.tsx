import { Link, router, useLocalSearchParams } from "expo-router";
import { Text, TextInput, View } from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../store";
import Avatar from "../../components/avatar";
import TimeAgo from "@andordavoti/react-native-timeago";
import { ArrowLeft, Share, Trash2 } from "lucide-react-native";
import AppButton from "../../components/app-button";
import { useState } from "react";

export default function GroupSettingsModal() {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);
  const { group } = useLocalSearchParams();
  const data = JSON.parse(group as string);
  const [groupName, setGroupName] = useState(data.name);

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
          icon={() => <Trash2 size={24} color="red" />}
          onPress={() => {
            router.back();
          }}
          color="#fff"
          size={24}
        />
      </Appbar.Header>
      <View className="flex-1 px-4">
        <View className="flex space-y-4">
          <Text className="text-3xl text-white font-bold">Group settings</Text>
          <TextInput
            value={groupName}
            onChangeText={setGroupName}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            placeholder="Your new group name"
            clearButtonMode="always"
            className="mb-2 text-white bg-[#232324] px-3 py-4 rounded-lg placeholder-[#8F8F91]"
          />
        </View>

        <SafeAreaView className="mt-auto">
          <AppButton
            text="Save"
            variant="primary"
            onPress={() => router.back()}
          />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}
