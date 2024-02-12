import { DBTransaction } from "../store/interfaces";
import React from "react";
import { useUserStore } from "../store/use-user-store";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Divider } from "react-native-paper";
import TransactionItem from "./transaction-item";

export default function TransactionsList({
  transactions,
  loading,
  setLoading,
  setTransactions,
  getTransactions,
  withAddress,
}: {
  transactions: DBTransaction[];
  loading: boolean;
  setLoading: (refreshing: boolean) => void;
  setTransactions: (transactions: DBTransaction[]) => void;
  getTransactions: {
    (address: string): Promise<DBTransaction[]>;
    (addressA: string, addressB: string): Promise<DBTransaction[]>;
  };
  withAddress?: string;
}) {
  const user = useUserStore((state) => state.user);
  React.useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const transactions: DBTransaction[] = await getTransactions(
        user?.address!,
        withAddress!
      );
      setTransactions(transactions);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Text className="text-[#53516C] font-semibold mt-4 mb-2">
        {withAddress ? "Transactions between you" : "Transaction History"}
      </Text>
      <Divider />
      {loading && transactions.length === 0 && (
        <View className="mt-4">
          <ActivityIndicator animating={true} color={"#C9B3F9"} />
        </View>
      )}
      {transactions.length === 0 && !loading && (
        <Text className="mt-4 text-white">
          No recent transactions available.
        </Text>
      )}
      {transactions.length > 0 && (
        <ScrollView className="h-full">
          {transactions.map((transaction, index) => (
            <TransactionItem
              transaction={transaction}
              index={index}
              key={`transaction-parent-${index}`}
            />
          ))}
        </ScrollView>
      )}
    </>
  );
}
