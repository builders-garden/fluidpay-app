import { Link, router } from "expo-router";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Searchbar } from "react-native-paper";
import Avatar from "../../../components/avatar";
import {
  useSendStore,
  useTransactionsStore,
  useUserStore,
} from "../../../store";
import { ChevronRight, Search } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TransactionItem from "../../../components/transaction-item";
import { getUsers } from "../../../lib/api";

export default function Send() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const user = useUserStore((state) => state.user);
  const setSendUser = useSendStore((state) => state.setSendUser);
  const transactions = useTransactionsStore((state) => state.transactions);

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
    <SafeAreaView className="bg-black flex-1">
      <View className="flex flex-row items-center justify-between px-4 max-w-screen">
        <View className="flex flex-row items-center space-x-4 pl-2">
          <Link href={"/app/settings"}>
            <Avatar name={user!.username.charAt(0).toUpperCase()} />
          </Link>
        </View>
        <Searchbar
          placeholder="@username"
          onChangeText={onChangeText}
          value={searchQuery}
          className="bg-white/10 !text-white w-3/4 mb-1"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          placeholderTextColor={"#8F8F91"}
          icon={() => <Search size={20} color={"white"} />}
          // traileringIcon={() => <QrCode size={20} color={"white"} />}
          theme={{ colors: { onSurfaceVariant: "#FFF" } }}
        />
      </View>
      <View className="flex-1 flex-col px-4 bg-black">
        {searchQuery !== "" ? (
          <>
            <Text className="text-[#8F8F91] font-semibold mt-8">
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
                  <ChevronRight size={16} color="#FFF" />
                </Pressable>
              ))}
            </View>
          </>
        ) : transactions.length > 0 ? (
          <View className="bg-[#161618] w-full mx-auto rounded-2xl px-4 mt-8">
            {transactions.map((transaction, index) => (
              <TransactionItem transaction={transaction} index={index} />
            ))}
          </View>
        ) : (
          <View className="flex-1 flex-col items-center justify-center"></View>
        )}
      </View>
    </SafeAreaView>
  );
}
