import { router } from "expo-router";
import {
  and,
  collection,
  getDocs,
  limit,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Appbar, Searchbar } from "react-native-paper";
import { firebaseFirestore } from "../../../firebaseConfig";
import Avatar from "../../../components/avatar";
import { useSendStore, useUserStore } from "../../../store";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Send() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const user = useUserStore((state) => state.user);
  const setSendUser = useSendStore((state) => state.setSendUser);

  const onChangeText = async (text: string) => {
    setSearchQuery(text);
    if (text) {
      // const docs = await getDocs()
      const q = query(
        collection(firebaseFirestore, "users"),
        or(
          and(
            where("username", ">=", text),
            where("username", "<=", text + "\uf8ff"),
            where("username", "!=", user?.username)
          )
          // and(
          //   where("address", ">=", text),
          //   where("address", "<=", text + "\uf8ff")
          // )
        ),
        orderBy("username", "desc"),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const result = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      setResults(result);
    } else {
      setResults([]);
    }
  };

  return (
    <>
      <Appbar.Header className="bg-[#201F2D] text-white">
        <Appbar.BackAction
          onPress={() => router.back()}
          color="#fff"
          size={20}
        />
        <Appbar.Content
          title="Send"
          color="#fff"
          titleStyle={{ fontWeight: "bold" }}
        />
      </Appbar.Header>
      <View className="flex-1 flex-col px-4 bg-[#201F2D]">
        <Searchbar
          placeholder="Search user, ENS or address..."
          onChangeText={onChangeText}
          value={searchQuery}
          className="bg-transparent border border-[#53516C] !text-white"
          iconColor="#C9B3F9"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          placeholderTextColor={"#53516C"}
          theme={{ colors: { onSurfaceVariant: "#FFF" } }}
        />
        {searchQuery !== "" && (
          <>
            <Text className="text-[#53516C] font-semibold mt-8">
              Search results
            </Text>
            <View className="flex flex-col space-y-4 mt-4">
              {results.length === 0 && (
                <Text className="text-white font-semibold">No results</Text>
              )}
              {results.map((result) => (
                <Pressable
                  className="flex flex-row items-center justify-between"
                  onPress={() => {
                    setSendUser(result);
                    router.push(`/app/send-modal`);
                  }}
                  key={result.id}
                >
                  <View className="flex flex-row items-center space-x-4">
                    <Avatar name={result.username.charAt(0).toUpperCase()} />
                    <Text className="text-white font-semibold text-lg">
                      {result.username}
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={16} color="#FFF" />
                </Pressable>
              ))}
            </View>
          </>
        )}
      </View>
    </>
  );
}
