import { router } from "expo-router";
import { ArrowLeft, Search, X, XCircle } from "lucide-react-native";
import { useState } from "react";
import { SafeAreaView, TextInput, Text, View, Pressable } from "react-native";
import { Appbar, Badge, Checkbox, Searchbar } from "react-native-paper";
import AppButton from "../../components/app-button";
import { createGroup, getUsers } from "../../lib/api";
import { useGroupsStore, useUserStore } from "../../store";
import SearchGroupMembers from "../../components/search-group-members";

export default function CreateGroupPage() {
  const [groupName, setGroupName] = useState("");
  const [creatingGroup, setCreatingGroup] = useState(false);
  const addGroup = useGroupsStore((state) => state.addGroup);
  const user = useUserStore((state) => state.user);
  const [addedMembers, setAddedMembers] = useState<any[]>([]);

  const createNewGroup = async () => {
    try {
      if (groupName.length > 3) {
        setCreatingGroup(true);
        const group = await createGroup(user!.token, {
          name: groupName,
          memberIds: [
            user!.id,
            ...(addedMembers ? [...addedMembers.map((m) => m.id)] : []),
          ],
        });
        addGroup(group);

        setCreatingGroup(false);
        router.push({
          pathname: "/app/group",
          params: { group: JSON.stringify(group) },
        });
      }
    } catch (error) {
      console.error("Error creating group", error);
      setCreatingGroup(false);
    }
  };

  return (
    <View className="flex-1 flex-col bg-black">
      <Appbar.Header
        elevated={false}
        statusBarHeight={48}
        className="bg-black text-white"
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
          title={""}
          color="#fff"
          titleStyle={{ fontWeight: "bold" }}
        />
      </Appbar.Header>
      <SafeAreaView className="flex-1 justify-between">
        <View className="flex px-4 space-y-4">
          <Text className="text-3xl text-white font-bold">Create group</Text>
          <Text className="text-white text-xl font-semibold mt-2">
            What's the name of your group?
          </Text>
          <TextInput
            value={groupName}
            onChangeText={setGroupName}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            placeholder="Your new group name"
            placeholderTextColor={"#8F8F91"}
            className="mb-2 text-white bg-[#232324] px-3 py-4 rounded-lg"
          />
          <Text className="text-white text-xl font-semibold mt-2 mb-2">
            Add one or more members
          </Text>
          <SearchGroupMembers
            addedMembers={addedMembers}
            setAddedMembers={setAddedMembers}
          />
        </View>
        <View className="px-4">
          <AppButton
            variant={groupName.length > 3 ? "primary" : "disabled"}
            onPress={() => createNewGroup()}
            text="Create group"
            loading={creatingGroup}
            disabled={creatingGroup}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
