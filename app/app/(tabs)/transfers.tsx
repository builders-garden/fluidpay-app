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
import { ScrollView } from "react-native-gesture-handler";
import { shortenAddress } from "../../../lib/utils";
import UserSearchResult from "../../../components/user-search-result";
import { DBTransaction, DBUser } from "../../../store/interfaces";

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

  function getInteractedUsers(): {
    user: DBUser;
    lastTransaction: DBTransaction;
  }[] {
    const interactedUsers: { user: DBUser; lastTransaction: DBTransaction }[] =
      [];

    transactions.forEach((transaction) => {
      if (transaction.payeeId === user!.id) {
        interactedUsers.push({
          user: transaction.payer,
          lastTransaction: transaction,
        });
      } else if (transaction.payerId === user!.id) {
        interactedUsers.push({
          user: transaction.payee,
          lastTransaction: transaction,
        });
      }
    });

    // Remove duplicates and keep the last transaction
    const uniqueInteractedUsers = Array.from(
      new Set(interactedUsers.map(({ user }) => user!.id))
    )
      .map((id) =>
        interactedUsers.reverse().find(({ user }) => user!.id === id)
      )
      .filter((user) => user !== undefined); // Filter out undefined values

    return uniqueInteractedUsers as any;
  }

  const interactedUsers = getInteractedUsers();

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
                <UserSearchResult user={result} />
              ))}
            </View>
          </>
        ) : transactions.length > 0 ? (
          <ScrollView className="bg-[#161618] w-full mx-auto rounded-2xl px-4 mt-8">
            {interactedUsers.map((user, index) => (
              <UserSearchResult
                user={user.user!}
                transaction={user.lastTransaction}
              />
            ))}
          </ScrollView>
        ) : (
          <View className="flex-1 flex-col items-center justify-center"></View>
        )}
      </View>
    </SafeAreaView>
  );
}
