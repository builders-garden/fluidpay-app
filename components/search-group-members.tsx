import { View, Pressable, Text } from "react-native";
import { Checkbox, Searchbar } from "react-native-paper";
import { DBUser } from "../store/interfaces";
import Avatar from "./avatar";
import { useState } from "react";
import { Search, X } from "lucide-react-native";
import { getUsers } from "../lib/api";
import { useUserStore } from "../store/use-user-store";

export default function SearchGroupMembers({
  addedMembers,
  setAddedMembers,
}: {
  addedMembers: DBUser[];
  setAddedMembers: any;
}) {
  const [results, setResults] = useState<DBUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useUserStore((state) => state.user);
  const onChangeText = async (text: string) => {
    setSearchQuery(text);
    if (text) {
      const users = await getUsers(user!.token, {
        limit: 10,
        query: text,
        page: 0,
      });
      setResults(users as DBUser[]);
    } else {
      setResults([]);
    }
  };
  return (
    <View className="flex flex-col space-y-4">
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
                  addedMembers.filter((member: any) => member.id !== user.id)
                )
              }
            >
              <View className="flex flex-col space-y-2 items-center justify-center">
                <View>
                  <Avatar name={user.displayName.charAt(0).toUpperCase()} />
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
        {results?.length > 0 && (
          <View className="flex flex-col space-y-2">
            <Text className="text-white text-xl font-semibold">
              Search results
            </Text>
            <View className="rounded-lg flex flex-col space-y-4 w-full py-4 px-2 bg-greyInput">
              {results.map((user: DBUser, index: number) => (
                <Pressable
                  key={"result- " + user.id}
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
                      color="#FF238C"
                      uncheckedColor="#8F8F91"
                    />
                    <Avatar name={user.displayName.charAt(0).toUpperCase()} />
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
  );
}
