import { Link, router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Appbar, Badge, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../store";
import { ArrowLeft, Search, Trash2 } from "lucide-react-native";
import AppButton from "../../components/app-button";
import { useState } from "react";
import { deleteGroup, getUsers, updateGroup } from "../../lib/api";
import Avatar from "../../components/avatar";
import SearchGroupMembers from "../../components/search-group-members";

export default function GroupSettingsModal() {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);
  const { group: localGroup } = useLocalSearchParams();
  const parsedGroup = JSON.parse(localGroup as string);
  const [data, setData] = useState<any>(parsedGroup);
  const [groupName, setGroupName] = useState(data.name);
  const [addedMembers, setAddedMembers] = useState<any[]>(
    data.members.map((d: any) => d.user)
  );
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const update = async () => {
    setIsUpdateLoading(true);
    const updateGroupData = {
      name: groupName,
      memberIds: [
        ...data.members.map((m: any) => m.user.id),
        ...addedMembers.map((m: any) => m.id),
      ],
    };
    await updateGroup(user!.token, { id: parsedGroup!.id }, updateGroupData);
    setIsUpdateLoading(false);
    router.back();
  };

  const deleteG = async () => {
    setIsDeleteLoading(true);
    const result = await deleteGroup(user!.token, { id: parsedGroup!.id });
    router.replace("/app/groups");
    setIsDeleteLoading(false);
  };

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
          icon={() =>
            isDeleteLoading ? (
              <ActivityIndicator size="small" color="red" />
            ) : (
              <Trash2 size={24} color="red" />
            )
          }
          onPress={async () => {
            await deleteG();
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
            className="mb-2 text-white bg-[#232324] px-3 py-4 rounded-xl placeholder-[#8F8F91]"
          />
          <Text className="text-white text-xl font-semibold mt-2 mb-2">
            Members
          </Text>
          <SearchGroupMembers
            addedMembers={addedMembers}
            setAddedMembers={setAddedMembers}
          />
        </View>

        <SafeAreaView className="mt-auto">
          <AppButton
            loading={isUpdateLoading}
            text="Save"
            variant="primary"
            onPress={() => update()}
          />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}
