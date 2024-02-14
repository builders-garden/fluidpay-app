import { Link, router } from "expo-router";
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
import { Searchbar } from "react-native-paper";
import { firebaseFirestore } from "../../../firebaseConfig";
import Avatar from "../../../components/avatar";
import { useSendStore, useUserStore } from "../../../store";
import { ChevronRight, QrCode, Search, Plus } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import TransactionItem from "../../../components/transaction-item";

export default function Send() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const user = useUserStore((state) => state.user);
  const setSendUser = useSendStore((state) => state.setSendUser);
  const transactions = [
    {
      receipt: null,
      from: "frankc",
      fromUsername: "frankc",
      to: "orbulo",
      toUsername: "orbulo",
      amount: "18.46",
      createdAt: new Date().toISOString(),
      txHash: "1",
    },
    {
      receipt: null,
      from: "frankc",
      fromUsername: "frankc",
      to: "orbulo",
      toUsername: "orbulo",
      amount: "18.46",
      createdAt: new Date().toISOString(),
      txHash: "2",
    },
    {
      receipt: null,
      from: "frankc",
      fromUsername: "frankc",
      to: "orbulo",
      toUsername: "orbulo",
      amount: "18.46",
      createdAt: new Date().toISOString(),
      txHash: "3",
    },
  ];

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
          className="bg-white/10 !text-white w-1/2 mb-1"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          placeholderTextColor={"#8F8F91"}
          icon={() => <Search size={20} color={"white"} />}
          traileringIcon={() => <QrCode size={20} color={"white"} />}
          theme={{ colors: { onSurfaceVariant: "#FFF" } }}
        />
        <TouchableOpacity onPress={() => {}}>
          <View className="flex flex-row items-center py-2 px-4 bg-[#3F89FF] border-2 border-[#3F89FF] rounded-full">
            <Plus size={24} color={"white"} />
            <Text className="text-lg text-white font-semibold ">New</Text>
          </View>
        </TouchableOpacity>
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
        ) : (
          <View className="bg-[#161618] w-full mx-auto rounded-2xl px-4 mt-8">
            <TransactionItem transaction={transactions[0]} index={0} />
            <TransactionItem transaction={transactions[1]} index={1} />
            <TransactionItem transaction={transactions[2]} index={2} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
