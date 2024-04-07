import { router } from "expo-router";
import {
  ArrowLeft,
  ChevronRight,
  Search,
  X,
  XCircle,
} from "lucide-react-native";
import { useState } from "react";
import { SafeAreaView, TextInput, Text, View, Pressable } from "react-native";
import { Appbar, Badge, Checkbox, Searchbar } from "react-native-paper";
import Avatar from "../../components/avatar";
import AppButton from "../../components/app-button";
import { createGroup, getUsers } from "../../lib/api";
import { useGroupsStore, useUserStore } from "../../store";

export default function CreateGroupPage() {
  const [groupName, setGroupName] = useState("");
  const addGroup = useGroupsStore((state) => state.addGroup);
  const user = useUserStore((state) => state.user);
  const [results, setResults] = useState<any[]>([]);
  const [addedMembers, setAddedMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const createNewGroup = async () => {
    if (groupName.length > 3) {
      const group = await createGroup(user!.token, {
        name: groupName,
        memberIds: [
          user!.id,
          ...(addedMembers ? [...addedMembers.map((m) => m.id)] : []),
        ],
      });
      addGroup(group);
      router.push({
        pathname: "/app/group",
        params: { group: JSON.stringify(group) },
      });
    }
  };

  const onChangeText = async (text: string) => {
    setSearchQuery(text);
    if (text) {
      // const docs = await getDocs()
      const users = await getUsers(user!.token, {
        limit: 10,
        query: text,
        page: 0,
      });
      setResults(users);
    } else {
      setResults([]);
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
          <Text className="text-white text-xl font-semibold mt-2">
            Add one or more members
          </Text>

          <Searchbar
            placeholder="@username"
            onChangeText={onChangeText}
            value={searchQuery}
            className="bg-white/10 !text-white mb-1"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            placeholderTextColor={"#8F8F91"}
            icon={() => <Search size={20} color={"white"} />}
            // traileringIcon={() => <QrCode size={20} color={"white"} />}
            theme={{ colors: { onSurfaceVariant: "#FFF" } }}
          />

          <View className="flex flex-col space-y-4">
            <View className="flex flex-row space-x-4">
              {addedMembers.map((user: any) => (
                <Pressable
                  key={"added-member-" + user.id}
                  onPress={() =>
                    setAddedMembers(
                      addedMembers.filter(
                        (member: any) => member.id !== user.id
                      )
                    )
                  }
                >
                  <View className="flex flex-col space-y-2 items-center justify-center">
                    <View>
                      <Avatar name={user.username.charAt(0).toUpperCase()} />
                      <View className="bg-red-600 rounded-full absolute -top-1 -right-1 border border-black p-1">
                        <X size={8} color={"black"} className={" text-black"} />
                      </View>
                    </View>
                    <Text className="text-white font-semibold">
                      {user.username}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
            {results.length > 0 && (
              <View className="flex flex-col space-y-2">
                <Text className="text-white text-xl font-semibold">
                  Search results
                </Text>
                <View className="rounded-lg flex flex-col space-y-4 w-full py-4 px-2 bg-greyInput">
                  {results.map((user: any, index) => (
                    <Pressable
                      onPress={() => {
                        if (!addedMembers.find((m) => m.id === user.id)) {
                          setAddedMembers([...addedMembers, user]);
                        } else {
                          setAddedMembers(
                            addedMembers.filter((m) => m.id !== user.id)
                          );
                        }
                      }}
                    >
                      <View className="flex flex-row items-center" key={index}>
                        <Checkbox.Android
                          status={
                            addedMembers.find((m) => m.id === user.id)
                              ? "checked"
                              : "unchecked"
                          }
                          color="#0061FF"
                          uncheckedColor="#8F8F91"
                        />
                        <Avatar name={user.username.charAt(0).toUpperCase()} />
                        <Text className="text-white font-semibold text-lg ml-2">
                          {user.username}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
        <View className="px-4">
          <AppButton
            variant={groupName.length > 3 ? "primary" : "disabled"}
            onPress={() => createNewGroup()}
            text="Create group"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
