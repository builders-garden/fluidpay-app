import { Link } from "expo-router";
import { useState } from "react";
import { View, Text } from "react-native";
import { Searchbar } from "react-native-paper";
import Avatar from "../../../components/avatar";
import { useTransactionsStore, useUserStore } from "../../../store";
import { Search } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUsers } from "../../../lib/api";
import UserSearchResult from "../../../components/user-search-result";
import { DBTransaction, DBUser } from "../../../store/interfaces";
import InteractedUser from "../../../components/interacted-user";

export default function Send() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const user = useUserStore((state) => state.user);
  const transactions = useTransactionsStore((state) => state.transactions);

  const onChangeText = async (text: string) => {
    setSearchQuery(text);
    if (text) {
      // const docs = await getDocs()
      const users = await getUsers(user?.token!, {
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
      if (transaction.payeeId === user?.id) {
        interactedUsers.push({
          user: transaction.payer,
          lastTransaction: transaction,
        });
      } else if (transaction.payerId === user?.id) {
        interactedUsers.push({
          user: transaction.payee,
          lastTransaction: transaction,
        });
      }
    });

    // Remove duplicates and keep the last transaction
    const uniqueInteractedUsers = Array.from(
      new Set(interactedUsers.map(({ user }) => user?.id))
    )
      .map((id) =>
        interactedUsers.reverse().find(({ user }) => user?.id === id)
      )
      .filter((user) => user !== undefined); // Filter out undefined values

    return uniqueInteractedUsers as any;
  }

  const interactedUsers = getInteractedUsers();

  return (
    <SafeAreaView className="bg-absoluteWhite dark:bg-black flex-1">
      <View className="flex flex-row items-center justify-between px-4 max-w-screen">
        <View className="flex flex-row items-center space-x-4 pl-2">
          <Link href={"/app/settings"}>
            <Avatar name={user?.displayName.charAt(0).toUpperCase()!} />
          </Link>
        </View>
        <Searchbar
          placeholder="@username"
          onChangeText={onChangeText}
          value={searchQuery}
          className="bg-darkGrey/10 dark:bg-white/10 !text-darkGrey dark:!text-white w-[80%] mb-1"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          placeholderTextColor={"#8F8F91"}
          icon={() => <Search size={20} color={"white"} />}
          // traileringIcon={() => <QrCode size={20} color={"white"} />}
          theme={{ colors: { onSurfaceVariant: "#FFF" } }}
        />
      </View>
      <View className="flex-1 flex-col px-4">
        {searchQuery !== "" ? (
          <>
            <Text className="text-mutedGrey font-semibold mt-8">
              Search results
            </Text>
            <View className="flex flex-col space-y-4 mt-4">
              {results.length === 0 && (
                <Text className="text-darkGrey dark:text-white font-semibold">
                  No results
                </Text>
              )}
              {results.map((result, index) => (
                <UserSearchResult
                  user={result}
                  key={"search-result-" + index + "-" + result.id}
                />
              ))}
            </View>
          </>
        ) : transactions.length > 0 ? (
          <View className="bg-white dark:bg-darkGrey w-full mx-auto rounded-2xl px-4 mt-8">
            {interactedUsers
              ?.slice(0, 5)
              .map((user, index) => (
                <InteractedUser
                  user={user.user}
                  transaction={user.lastTransaction}
                  key={"interacted-user-" + index}
                />
              ))}
          </View>
        ) : (
          <View className="flex-1 flex-col items-center justify-center"></View>
        )}
      </View>
    </SafeAreaView>
  );
}
