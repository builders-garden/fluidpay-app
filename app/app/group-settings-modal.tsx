import { Link, router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";
import { Appbar, Badge, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../store";
import { ArrowLeft, Search, Trash2 } from "lucide-react-native";
import AppButton from "../../components/app-button";
import { useState } from "react";
import { deleteGroup, getUsers, updateGroup } from "../../lib/api";
import Avatar from "../../components/avatar";

export default function GroupSettingsModal() {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);
  const { group: localGroup } = useLocalSearchParams();
  const parsedGroup = JSON.parse(localGroup as string);
  const [data, setData] = useState<any>(parsedGroup);
  const [groupName, setGroupName] = useState(data.name);
  const [results, setResults] = useState<any[]>([]);
  const [username, setUsername] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedMembers, setAddedMembers] = useState<any[]>([]);
  const members = data.members.filter(
    (member: any) => member.user.id !== user?.id
  );

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

  const update = async () => {
    const updateGroupData = {
      name: groupName,
      memberIds: [
        ...data.members.map((m: any) => m.user.id),
        ...addedMembers.map((m: any) => m.id),
      ],
    };
    await updateGroup(user!.token, { id: parsedGroup!.id }, updateGroupData);

    router.back();
  };

  const deleteG = async () => {
    console.log(user!.token, { id: parsedGroup!.id });
    const result = await deleteGroup(user!.token, { id: parsedGroup!.id });
    console.log(result);
    router.replace("/app/groups");
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
          icon={() => <Trash2 size={24} color="red" />}
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
          <View className="bg-[#232324] p-4 rounded-xl flex flex-col space-y-4">
            {data.members.map((member: any, index: number) => (
              <View className="flex flex-row items-center justify-between" key={`member-${index}`}>
                <Pressable
                  onPress={() => {
                    router.push({
                      pathname: "/app/profile-modal",
                      params: { userId: member.user.id },
                    });
                  }}
                >
                  <View className="flex flex-row space-x-2">
                    <Avatar
                      name={member.user.username.charAt(0).toUpperCase()}
                    />
                    <View className="flex flex-col items-start justify-center">
                      <Text className="text-white font-semibold text-xl">
                        {member.user.displayName}
                      </Text>
                      <Text className="text-[#8F8F91] font-semibold">
                        @{member.user.username}
                      </Text>
                    </View>
                  </View>
                </Pressable>
                {member.user.id !== user?.id && (
                  <Pressable
                    onPress={() => {
                      const updatedMembers = data.members.filter(
                        (m: any) => m.user.id !== member.user.id
                      );
                      setData({ ...data, members: updatedMembers });
                    }}
                  >
                    <Text className="text-[#8F8F91] font-semibold">Remove</Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
          <Text className="text-white text-xl font-semibold mt-2">
            Invite members
          </Text>
          <Searchbar
            placeholder="@username"
            onChangeText={onChangeText}
            value={searchQuery}
            className="bg-[#232324] !text-white mb-1"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            placeholderTextColor={"#8F8F91"}
            icon={() => <Search size={20} color={"white"} />}
            // traileringIcon={() => <QrCode size={20} color={"white"} />}
            theme={{ colors: { onSurfaceVariant: "#FFF" } }}
          />
          <View className="flex flex-row space-x-4">
            {addedMembers.map((user: any) => (
              <Pressable
                onPress={() =>
                  setAddedMembers(
                    addedMembers.filter((member: any) => member.id !== user.id)
                  )
                }
              >
                <View className="flex flex-col space-y-2 items-center justify-center">
                  <Avatar name={user.username.charAt(0).toUpperCase()} />
                  <Text className="text-white font-semibold">
                    {user.username}
                  </Text>
                </View>
                <Badge className={"absolute -top-1 -right-2"} visible={true}>
                  -
                </Badge>
              </Pressable>
            ))}
            {results
              .filter(
                (user: any) =>
                  members.filter((member: any) => member.user.id === user.id)
                    .length === 0 &&
                  addedMembers.filter((member: any) => member.id === user.id)
                    .length === 0
              )
              .map((user: any) => (
                <Pressable
                  onPress={() => {
                    setAddedMembers(addedMembers.concat([user]));
                  }}
                >
                  <View className="flex flex-col space-y-2 items-center justify-center">
                    <Avatar name={user.username.charAt(0).toUpperCase()} />
                    <Text className="text-white font-semibold">
                      {user.username}
                    </Text>
                  </View>
                  <Badge
                    className={"absolute -top-1 -right-2"}
                    style={{ backgroundColor: "green" }}
                    visible={true}
                  >
                    +
                  </Badge>
                </Pressable>
              ))}
          </View>
        </View>

        <SafeAreaView className="mt-auto">
          <AppButton text="Save" variant="primary" onPress={() => update()} />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}
